import { ChangeEvent, useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { Flex, Heading, Button, Input, Select } from "@chakra-ui/react"
import { Sidebar } from "@/components/sidebar"
import { canSSRAuth } from "@/utils/canSSRAuth"
import { setupAPIClient } from "@/services/api"

interface NewProps {
    haircuts: HaircutProps[]
}

interface HaircutProps {
    id: string
    name: string
    price: number | string
    status: boolean
    user_id: string
}

export default function New({ haircuts }: NewProps) {
    const router = useRouter()
    const [customer, setCustomer] = useState("")
    const [haircutSelected, setHaircutSelected] = useState(haircuts[0])

    function handleChangeSelect(e: string) {
        const haircutsItem = haircuts.find(item => item.id === e)
        setHaircutSelected(haircutsItem)
    }

    async function handleRegister() {
        if (customer === "") {
            alert("Insira o nome do cliente")
            return
        }
        try {
            const apiClient = setupAPIClient()
            await apiClient.post("/schedule", {
                customer: customer,
                haircut_id: haircutSelected?.id
            })
            router.push("/dashboard")
            alert("Atendimento registrado")
        } catch (err) {
            console.log("ERROR TO CREATE SCHEDULE", err)
            alert("ERROR")
        }
    }

    return (
        <>
            <Head>
                <title>Barber pro - Novo agendamento</title>
            </Head>
            <Sidebar>
                <Flex direction={"column"} alignItems={"flex-start"} justifyContent={"flex-start"}>
                    <Flex direction={"row"} width={"100%"} alignItems={"center"} justifyContent={"flex-start"}>
                        <Heading color={"white"} fontSize={"3xl"} marginY={4} marginRight={4}>
                            Novo corte
                        </Heading>
                    </Flex>

                    <Flex maxWidth={"700px"} paddingY={8} width={"100%"} direction={"column"} alignItems={"center"} justifyContent={"center"} background={"barber.400"} rounded={4}>
                        <Input
                            width={"85%"}
                            size={"lg"}
                            placeholder="Nome do cliente"
                            color={"white"}
                            type="text"
                            marginBottom={3}
                            background={"barber.900"}
                            value={customer}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomer(e.target.value)}
                        />
                        <Select
                            marginBottom={3}
                            size={"lg"}
                            width={"85%"}
                            color={"barber.400"}
                            background={"barber.900"}
                            onChange={(e) => handleChangeSelect(e.target.value)}
                        >
                            {haircuts?.map(item => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </Select>
                        <Button onClick={handleRegister} width={"85%"} size={"lg"} color={"gray.900"} background={"button.cta"} _hover={{ background: "#ffb13e" }}>
                            Registrar
                        </Button>
                    </Flex>

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
                    permanent: false
                }
            }
        }
        return {
            props: {
                haircuts: response.data
            }
        }
    } catch (err) {
        console.log("ERROR GET SCHEDULE SERVERSIDE", err)
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false
            }
        }
    }
})