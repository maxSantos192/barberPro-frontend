import { useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { Flex, Heading, Text, Button, useMediaQuery, Input } from "@chakra-ui/react"
import { FiChevronLeft } from "react-icons/fi"
import { canSSRAuth } from "@/utils/canSSRAuth"
import { setupAPIClient } from "@/services/api"

interface NewHaircutProps {
    subscriptions: boolean
    count: number
}

export default function NewHaircut({ subscriptions, count }: NewHaircutProps) {
    const [isMobile] = useMediaQuery("(max-width: 500px)")

    const [name, setName] = useState("")
    const [price, setPrice] = useState("")

    async function handleRegister() {
        if (name === "" || price === "") {
            return
        }
        try {
            const apiClient = setupAPIClient()
            await apiClient.post("/haircut", {
                name: name,
                price: Number(price),
            })
            setName("")
            setPrice("")
            alert("Corte cadastrado com sucesso!")
        } catch (err) {
            console.log("ERROR TO REGISTER HAIRCUT: ", err)
        }
    }

    return (
        <>
            <Head>
                <title>Barber pro - Cadastrar corte</title>
            </Head>
            <Sidebar>
                <Flex direction={"column"} alignItems={"flex-start"} justifyContent={"flex-start"}>

                    <Flex direction={isMobile ? "column" : "row"} width={"100%"} alignItems={isMobile ? "flex-start" : "center"} marginBottom={isMobile ? 4 : 0}>
                        <Link href={"/haircuts"}>
                            <Button padding={4} display={"flex"} alignItems={"center"} justifyContent={"center"} marginRight={4}>
                                <FiChevronLeft size={24} color={"#12131b"} />
                                Voltar
                            </Button>
                        </Link>

                        <Heading color={"orange.900"} marginTop={4} marginBottom={4} marginRight={4} fontSize={isMobile ? "28px" : "3xl"}>
                            Modelo de corte
                        </Heading>

                    </Flex>

                    <Flex direction={"column"} maxWidth={"700px"} background={"barber.400"} width={"100%"} alignItems={"center"} justifyContent={"center"} paddingY={8}>
                        <Heading marginBottom={4} color={"white"} fontSize={isMobile ? "22px" : "3xl"}>Cadastrar modelo</Heading>

                        <Input
                            color={"white"}
                            placeholder="Nome do corte"
                            size={"lg"}
                            type="text"
                            width={"85%"}
                            background={"gray.900"}
                            marginBottom={3}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            color={"white"}
                            placeholder="Valor do corte"
                            size={"lg"}
                            type="number"
                            width={"85%"}
                            background={"gray.900"}
                            marginBottom={4}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <Button onClick={handleRegister} width={"85%"} size={"lg"} color={"gray.900"} marginBottom={6} background={"button.cta"} _hover={{ background: "#ffb13e" }} isDisabled={!subscriptions && count >= 3}>
                            Salvar
                        </Button>

                        {!subscriptions && count >= 3 && (
                            <Flex direction={"row"} alignItems={"center"} justifyContent={"center"}>
                                <Text color={"white"}>
                                    Você atingiu o limite de cadastros para essa assinatura.
                                </Text>
                                <Link href={"/planos"}>
                                    <Text fontSize={17} color={"#31fb6a"} fontWeight={"bold"} cursor={"pointer"} marginLeft={1}>
                                        Seja premium
                                    </Text>
                                </Link>
                            </Flex>
                        )}

                    </Flex>

                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {
        const apiClient = setupAPIClient(ctx)
        const response = await apiClient.get("/haircut/check")
        const count = await apiClient.get("/haircut/count")

        return {
            props: {
                subscriptions: response.data?.subscriptions?.status === "active" ? true : false,
                count: count.data
            }
        }
    } catch (err) {
        console.log(err)
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false
            }
        }
    }
})