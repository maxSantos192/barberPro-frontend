import { ChangeEvent, useState } from "react"
import Head from "next/head"
import { Flex, Text, Input, Heading, Button, useMediaQuery, Switch, Stack } from "@chakra-ui/react"
import { Sidebar } from "@/components/sidebar"
import { FiChevronLeft } from "react-icons/fi"
import Link from "next/link"
import { canSSRAuth } from "@/utils/canSSRAuth"
import { setupAPIClient } from "@/services/api"

interface EditHaircutProps {
    haircut: HaircutProps
    subscriptions: SubscriptionsProps | null
}

interface HaircutProps {
    id: string
    name: string
    price: string | number
    status: boolean
    user_id: string
}

interface SubscriptionsProps {
    id: string
    status: string
}

export default function EditHaircut({ subscriptions, haircut }: EditHaircutProps) {
    const [isMobile] = useMediaQuery("(max-width: 500px)")

    const [haircutName, setHaircutName] = useState(haircut?.name)
    const [haircutPrice, setHaircutPrice] = useState(haircut?.price)
    const [haircutStatus, setHaircutStatus] = useState(haircut?.status)
    const [disableHaircut, setDisableHaircut] = useState(haircut?.status ? "disabled" : "enabled")

    function handleChangeStatus(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.value === "disabled") {
            setDisableHaircut("enabled")
            setHaircutStatus(false)
        } else {
            setDisableHaircut("disabled")
            setHaircutStatus(true)
        }
    }

    async function handleUpdate() {
        if (haircutName === "" || haircutPrice === "") {
            return
        }
        try {
            const apiClient = setupAPIClient()
            await apiClient.put("/haircut", {
                name: haircutName,
                price: Number(haircutPrice),
                status: haircutStatus,
                haircut_id: haircut?.id,
            })
        } catch (err) {
            console.log("ERROR TO UPDATE NAME OR PRICE OF HAIRCUT", err)
        }
    }

    return (
        <>
            <Head>
                <title>Barber Pro - Editar modelo de corte</title>
            </Head>
            <Sidebar>
                <Flex direction={"column"} alignItems={"flex-start"} justifyContent={"flex-start"}>

                    <Flex direction={isMobile ? "column" : "row"} width={"100%"} alignItems={isMobile ? "flex-start" : "center"} justifyContent={"flex-start"} marginBottom={isMobile ? 4 : 0}>
                        <Link href={"/haircuts"}>
                            <Button marginRight={3} padding={4} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                                <FiChevronLeft size={24} color={"#12131b"} />
                                Voltar
                            </Button>
                        </Link>
                        <Heading color={"white"} fontSize={isMobile ? "22px" : "3xl"}>
                            Editar corte
                        </Heading>
                    </Flex>

                    <Flex marginTop={4} maxWidth={"700px"} paddingY={8} width={"100%"} background={"barber.400"} direction={"column"} alignItems={"center"} justifyContent={"center"} rounded={4}>
                        <Heading marginBottom={4} color={"white"} fontSize={isMobile ? "22px" : "3xl"}>
                            Editar corte
                        </Heading>

                        <Flex width={"85%"} justifyContent={"center"} alignItems={"center"} direction={"column"}>
                            <Input
                                placeholder="Nome do corte"
                                color={"white"}
                                size={"lg"}
                                marginBottom={3}
                                background={"gray.900"}
                                type={"text"}
                                width={"100%"}
                                value={haircutName}
                                onChange={(e) => setHaircutName(e.target.value)}
                            />
                            <Input
                                placeholder="Valor do corte"
                                color={"white"}
                                size={"lg"}
                                marginBottom={3}
                                background={"gray.900"}
                                type={"number"}
                                width={"100%"}
                                value={haircutPrice}
                                onChange={(e) => setHaircutPrice(e.target.value)}
                            />

                            <Stack marginRight={"auto"} marginTop={3} marginBottom={6} alignItems={"center"} direction={"row"}>
                                <Text color={"white"} fontWeight={"bold"}>Desativar corte</Text>
                                <Switch size={"lg"} colorScheme={"red"} value={disableHaircut} isChecked={disableHaircut === "disabled" ? false : true}  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeStatus(e)}/>
                            </Stack>

                            <Button onClick={handleUpdate} marginBottom={6} width={"100%"} background={"button.cta"} color={"gray.900"} _hover={{ bg: "#ffb13e" }} isDisabled={subscriptions?.status !== "active"}>
                                Salvar
                            </Button>

                            {subscriptions?.status !== "active" && (
                                <Flex direction={"row"} alignItems={"center"} justifyContent={"center"}>
                                    <Link href={"/planos"}>
                                        <Text fontWeight={"bold"} marginRight={1} color={"#31fb6a"} cursor={"pointer"}>
                                            Seja premium
                                        </Text>
                                    </Link>
                                    <Text color={"white"}>
                                        e tenha todas as vantagens!
                                    </Text>
                                </Flex>
                            )}

                        </Flex>

                    </Flex>

                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const { id } = ctx.params

    try {
        const apiClient = setupAPIClient(ctx)
        const check = await apiClient.get("/haircut/check")
        const response = await apiClient.get("/haircut/detail", {
            params: {
                haircut_id: id
            }
        })
        return {
            props: {
                haircut: response.data,
                subscriptions: check.data?.subscriptions,
            }
        }
    } catch (err) {
        console.log("SERVER SIDE ERROR EDIT HAIRCUT REQUIRE HAIRCUT DETAILS", err)
        return {
            redirect: {
                destination: "/haircuts",
                permanent: false,
            }
        }
    }
})