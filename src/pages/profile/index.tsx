import { useContext, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { Flex, Text, Heading, Box, Input, Button } from "@chakra-ui/react"
import { Sidebar } from "@/components/sidebar"
import { canSSRAuth } from "@/utils/canSSRAuth"
import { AuthContext } from "@/contexts/AuthContext"
import { setupAPIClient } from "@/services/api"

interface UserProps {
    id: string
    name: string
    email: string
    endereco: string | null
    phone: string | null
}

interface ProfileProps {
    user: UserProps
    premium: boolean
}

export default function Profile({ user, premium }: ProfileProps) {
    const { logoutUser } = useContext(AuthContext)

    const [name, setName] = useState(user && user?.name)
    const [adress, setAdress] = useState(user?.endereco ? user?.endereco : "")

    async function handleLogout() {
        await logoutUser()
    }

    async function handleUpdateUser() {
        if (name === "") {
            return
        }
        try {
            const apiClient= setupAPIClient()
            await apiClient.put("/users", {
                name: name,
                endereco: adress,
            })            
        } catch (err) {
            console.log("UPDATE ERROR: ", err)
        }
    }

    return (
        <>
            <Head>
                <title>Barber Pro - Minha conta</title>
            </Head>
            <Sidebar>
                <Flex direction={"column"} alignItems={"flex-start"} justifyContent={"flex-start"}>
                    <Flex width={"100%"} direction={"row"} alignItems={"center"} justifyContent={"flex-start"}>
                        <Heading fontSize={"3xl"} color={"orange.900"} marginBottom={4} marginRight={4}>Minha conta</Heading>
                    </Flex>

                    <Flex rounded={4} paddingTop={8} paddingBottom={8} background={"barber.400"} maxWidth={"700px"} width={"100%"} direction={"column"} align={"center"} justifyContent={"center"} >
                        <Flex direction={"column"} width={"85%"}>
                            <Text color={"white"} marginBottom={2} fontSize={"xl"} fontWeight={"bold"}>Nome da barbearia:</Text>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                width={"100%"}
                                background={"gray.900"}
                                placeholder="Nome da barbearia"
                                color={"white"}
                                size={"lg"}
                                type="text"
                                marginBottom={3}
                            />

                            <Text color={"white"} marginBottom={2} fontSize={"xl"} fontWeight={"bold"}>Endereço:</Text>
                            <Input
                                value={adress}
                                onChange={(e) => setAdress(e.target.value)}
                                width={"100%"}
                                background={"gray.900"}
                                placeholder="Endereço barbearia"
                                color={"white"}
                                size={"lg"}
                                type="text"
                                marginBottom={3}
                            />

                            <Text color={"white"} marginBottom={2} fontSize={"xl"} fontWeight={"bold"}>Plano atual:</Text>
                            <Flex direction={"row"} width={"100%"} marginBottom={3} padding={1} borderWidth={1} rounded={6} background={"barber.900"} alignItems={"center"} justifyContent={"space-between"}>
                                <Text padding={2} fontSize={"lg"} color={premium ? "#fba931" : "#4dffb4"}>Plano {premium ? "Premium" : "Grátis"}</Text>
                                <Link href={"/planos"}>
                                    <Box cursor={"pointer"} padding={1} paddingLeft={2} paddingRight={2} background={"#00cd52"} rounded={4} color={"white"}>Mudar plano</Box>
                                </Link>
                            </Flex>

                            <Button onClick={handleUpdateUser} width={"100%"} marginTop={3} marginBottom={4} background={"button.cta"} size={"lg"} _hover={{ background: "#ffb13e" }} color={"white"}>Salvar</Button>
                            <Button onClick={handleLogout} width={"100%"} marginBottom={6} background={"transparent"} borderWidth={2} borderColor={"red.500"} color={"red.500"} size={"lg"} _hover={{ background: "transparent" }}>Sair</Button>

                        </Flex>
                    </Flex>

                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {
        const apiClient = setupAPIClient(ctx)
        const response = await apiClient.get("/me")

        const user = {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            endereco: response.data.endereco,
            phone: response.data.phone,
        }
        return {
            props: {
                user: user,
                premium: response.data?.subscriptions?.status === 'active' ? true : false
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