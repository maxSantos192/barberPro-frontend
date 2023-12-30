import { useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { Flex, Text, Heading, Button, useMediaQuery, Link as ChakraLink, useDisclosure } from "@chakra-ui/react"
import { IoMdPerson } from "react-icons/io"
import { canSSRAuth } from "@/utils/canSSRAuth"
import { Sidebar } from "@/components/sidebar"
import { setupAPIClient } from "@/services/api"
import { ModalInfo } from "@/components/modal"

interface DashboardProps {
    schedule: ScheduleItem[]
}

export interface ScheduleItem {
    id: string
    customer: string
    haircut: {
        id: string
        name: string
        price: string | number
        user_id: string
    }
}

export default function Dashboard({ schedule }: DashboardProps) {
    const [isMobile] = useMediaQuery("(max-width: 500px)")
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [list, setList] = useState(schedule)
    const [service, setService] = useState<ScheduleItem>()

    function handleOpenModal(item: ScheduleItem) {
        setService(item)
        onOpen()
    }

    async function handleFinish(id: string) {
        try {
            const apiClient = setupAPIClient()
            await apiClient.delete("/schedule", {
                params: {
                    schedule_id: id
                }
            })
            const filterItem = list.filter(item => {
                return (item?.id !== id)
            })
            setList(filterItem)
            onClose()
        } catch (err) {
            console.log("ERROR TO FINISH SERVICE", err)
            onClose()
            alert("Erro ao finalizar o serviço.")
        }
    }

    return (
        <>
            <Head>
                <title>Barber Pro - Dashboard</title>
            </Head>
            <Sidebar>
                <Flex direction={"column"} alignItems={"flex-start"} justifyContent={"flex-start"}>

                    <Flex width={"100%"} direction={"row"} alignItems={"center"} justifyContent={"flex-start"}>
                        <Heading fontSize={"3xl"} marginRight={4} marginY={4} color={"white"}>
                            Agenda
                        </Heading>
                        <Link href={"/new"}>
                            <Button>
                                Registrar
                            </Button>
                        </Link>
                    </Flex>

                    {list.map(item => (
                        <ChakraLink onClick={() => handleOpenModal(item)} key={item.id} justifyContent={"center"} width={"100%"} margin={0} padding={0} marginTop={1} background={"transparent"} style={{ textDecoration: "none" }}>
                            <Flex width={"100%"} direction={isMobile ? "column" : "row"} padding={4} rounded={4} marginBottom={2} background={"barber.400"} justifyContent={"space-between"} alignItems={isMobile ? "center" : "flex-start"}>

                                <Flex direction={"row"} marginBottom={isMobile ? 2 : 0} alignItems={"center"} justifyContent={"center"}>
                                    <IoMdPerson size={28} color={"#f1f1f1"} />
                                    <Text color={"white"} marginLeft={4} noOfLines={2} fontWeight={"bold"}>{item.customer}</Text>
                                </Flex>

                                <Text color={"white"} fontWeight={"bold"} marginBottom={isMobile ? 2 : 0}>
                                    {item.haircut.name}
                                </Text>

                                <Text color={"white"} fontWeight={"bold"} marginBottom={isMobile ? 2 : 0}>
                                    R$ {item.haircut.price}
                                </Text>

                            </Flex>
                        </ChakraLink>
                    ))}

                </Flex>
            </Sidebar>
            <ModalInfo
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                data={service}
                finishServise={() => handleFinish(service?.id)}
            />
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {
        const apiClient = setupAPIClient(ctx)
        const response = await apiClient.get("/schedule")
        return {
            props: {
                schedule: response.data
            }
        }
    } catch (err) {
        console.log("ERROR TO GET LIST SCHEDULE", err)
        return {
            props: {
                schedule: []
            }
        }
    }
})