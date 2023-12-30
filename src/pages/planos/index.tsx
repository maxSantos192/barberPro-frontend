import Head from "next/head"
import { Flex, Text, Button, Heading, useMediaQuery } from "@chakra-ui/react"
import { Sidebar } from "@/components/sidebar"
import { canSSRAuth } from "@/utils/canSSRAuth"
import { setupAPIClient } from "@/services/api"

interface SubscriptionProps {
    subscription: boolean
}

export default function Planos({ subscription }: SubscriptionProps) {
    const [isMobile] = useMediaQuery("(max-width: 500px)")

    return (
        <>
            <Head>
                <title>Barber pro - Sua assinatura</title>
            </Head>
            <Sidebar>
                <Flex width={"100%"} direction={"column"} alignItems={"flex-start"} justifyContent={"flex-start"}>
                    <Heading color={"white"} fontSize={"3xl"} marginY={4} marginRight={4}>
                        Planos
                    </Heading>
                </Flex>

                <Flex paddingBottom={8} maxWidth={"780px"} width={"100%"} direction={"column"} alignItems={"flex-start"} justifyContent={"flex-start"}>
                    <Flex width={"100%"} gap={4} flexDirection={isMobile ? "column" : "row"}>
                        <Flex rounded={4} padding={2} flex={1} background={"barber.400"} direction={"column"}>
                            <Heading color={"gray.100"} textAlign={"center"} fontSize={"2xl"} marginTop={2} marginBottom={4}>
                                Plano gratuito
                            </Heading>
                            <Text color={"white"} fontWeight={"medium"} marginLeft={4} marginBottom={2}>Registrar atendimentos.</Text>
                            <Text color={"white"} fontWeight={"medium"} marginLeft={4} marginBottom={2}>Crie apenas três modelos de cortes.</Text>
                            <Text color={"white"} fontWeight={"medium"} marginLeft={4} marginBottom={2}>Editar dados do perfil.</Text>
                        </Flex>

                        <Flex rounded={4} padding={2} flex={1} background={"barber.400"} direction={"column"}>
                            <Heading color={"#31fb6a"} textAlign={"center"} fontSize={"2xl"} marginTop={2} marginBottom={4}>
                                Premium
                            </Heading>
                            <Text color={"white"} fontWeight={"medium"} marginLeft={4} marginBottom={2}>Registrar atendimentos ilimitado.</Text>
                            <Text color={"white"} fontWeight={"medium"} marginLeft={4} marginBottom={2}>Crie modelos de cortes ilimitados.</Text>
                            <Text color={"white"} fontWeight={"medium"} marginLeft={4} marginBottom={2}>Editar dados do perfil.</Text>
                            <Text color={"white"} fontWeight={"medium"} marginLeft={4} marginBottom={2}>Editar modelos de corte.</Text>
                            <Text color={"white"} fontWeight={"medium"} marginLeft={4} marginBottom={2}>Receber atualizações.</Text>
                            <Text color={"#31fb6a"} fontWeight={"bold"} fontSize={"2xl"} marginLeft={4} marginBottom={2}>R$ 7,99</Text>

                            <Button onClick={() => { }} isDisabled={subscription} background={subscription ? "#31fb6a" : "button.cta"} _hover={{ bg: "#31fb6a" }} margin={2} color={"white"}>
                                {subscription ? (
                                    "Você já é premium!"
                                ) : "Seja premium!"}
                            </Button>

                            {subscription && (
                                <Button onClick={() => { }} background={"white"} _hover={{ bg: "white" }} margin={2} color={"barber.900"} fontWeight={"bold"}>
                                    Mudar plano
                                </Button>
                            )}

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
        return {
            props: {
                subscription: response?.data.subscriptions?.status === "active" ? true : false
            }
        }
    } catch (err) {
        console.log("ERROR TO GET SUBSCRIPTIONS USER:", err)
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false
            }
        }
    }
})