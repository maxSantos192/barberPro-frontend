import { useState, ChangeEvent } from "react"
import Head from "next/head"
import { Sidebar } from "@/components/sidebar"
import { Flex, Text, Heading, Button, Stack, Switch, useMediaQuery, Link } from "@chakra-ui/react"
import { IoMdPricetag } from "react-icons/io"
import { canSSRAuth } from "@/utils/canSSRAuth"
import { setupAPIClient } from "@/services/api"

interface HaircutsProps {
    haircuts: HaircutsItem[]
}

interface HaircutsItem {
    id: string
    name: string
    price: number | string
    status: boolean
    user_id: string
}

export default function Haircut({ haircuts }: HaircutsProps) {
    const [isMobile] = useMediaQuery("(max-width: 500px)")

    const [haircutsList, setHaircutsList] = useState<HaircutsItem[]>(haircuts || [])
    const [disableHaircut, setDisableHaircut] = useState("enabled")

    async function handleDisabled(e: ChangeEvent<HTMLInputElement>) {
        const apiClient = setupAPIClient()


        if (e.target.value === "disabled") {
            setDisableHaircut("enabled")
            const response = await apiClient.get("/haircuts", {
                params: {
                    status: true
                }
            })
            setHaircutsList(response.data)
        } else {
            setDisableHaircut("disabled")
            const response = await apiClient.get("/haircuts", {
                params: {
                    status: false
                }
            })
            setHaircutsList(response.data)
        }
    }

    return (
        <>
            <Head>
                <title>Barber Pro - Cortes de cabelo</title>
            </Head>
            <Sidebar>
                <Flex direction={"column"} alignItems={"flex-start"} justifyContent={"flex-start"}>
                    <Flex direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent={"flex-start"} marginBottom={0} width={"100%"}>
                        <Heading fontSize={isMobile ? "28px" : "3xl"} marginTop={4} marginBottom={4} marginRight={4} color={"orange.900"}>
                            Modelos de corte
                        </Heading>
                        <Link href={"/haircuts/new"}>
                            <Button>Cadastrar novo</Button>
                        </Link>
                        <Stack marginLeft={"auto"} align={"center"} direction={"row"}>
                            <Text fontWeight={"bold"} color={"white"}>Ativos</Text>
                            <Switch
                                colorScheme={"green"}
                                size={"lg"}
                                value={disableHaircut}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleDisabled(e)}
                                isChecked={disableHaircut === "disabled" ? false : true}
                            />
                        </Stack>
                    </Flex>

                    {haircutsList.map(haircut => (
                        <Link key={haircut.id} href={`/haircuts/${haircut.id}`} width={"100%"}>
                            <Flex cursor={"pointer"} width={"100%"} padding={4} background={"barber.400"} direction={isMobile ? "column" : "row"} rounded={4} marginBottom={2} justifyContent={"space-between"} alignItems={isMobile ? "flex-start" : "center"}>
                                <Flex marginBottom={isMobile ? 2 : 0} direction={"row"} alignItems={"center"} justifyContent={"center"}>
                                    <IoMdPricetag size={28} color={"#fba931"} />
                                    <Text fontWeight={"bold"} color={"#fba931"} marginLeft={2} noOfLines={2}>{haircut.name}</Text>
                                </Flex>

                                <Text color={"white"} fontWeight={"bold"}>Preço: R$ {haircut.price}</Text>
                            </Flex>
                        </Link>
                    ))}

                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {
        const apiClient = setupAPIClient(ctx)
        const response = await apiClient.get("/haircuts", {
            params: {
                status: true
            }
        })

        if (response.data === null) {
            return {
                redirect: {
                    destination: "/dashboard",
                    permanent: false,
                }
            }
        }

        return {
            props: {
                haircuts: response.data
            }
        }
    } catch (err) {
        console.log("SERVER SIDE ERROR HAIRCUT", err)
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false,
            }
        }
    }
})