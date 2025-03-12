import { Flex, Box, Button, Text } from "@chakra-ui/react";
import { ethers, JsonRpcSigner } from "ethers";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toaster, Toaster  } from "../components/ui/toaster";

interface HeaderProps {
    signer: JsonRpcSigner | null;
    setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>;
}

export default function Header({ signer, setSigner }: HeaderProps) {
    const connectWallet = async () => {
        try {
            if(!window.ethereum) {
                toaster.create({
                    title: "Metamask가 설치되어있지 않습니다.",
                    type: "error",
                })
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);

            setSigner(await provider.getSigner());
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if(!signer) return;

        toaster.create({
            title: `Welcome! ${signer.address}`,
            type: "info",
            duration: 1500
        })
    }, [signer]);

    return (
        <Box as="header" bgColor={"blue.100"} p={4}>
            <Toaster />
            <Flex
                maxW={1024}
                mx="auto"
                bgColor="red.100"
                alignItems="center"
                justifyContent="space-between"
            >
                <Flex
                    fontSize="2xl"
                    fontWeight="semibold"
                    alignItems="center"
                    gap={2}
                >

                    <Box fontSize="2xl" fontWeight="semibold">
                        🌳 Tree NFT
                    </Box>
                </Flex>
                <Box>
                    {!signer
                    ? <Button colorPalette="green" onClick={connectWallet}>
                        로그인
                    </Button>
                    :
                    <Flex alignItems="center">
                        <Text bgColor="green.300" px={2} py={1}>
                            {signer.address.substring(0, 7)}...
                            {signer.address.substring(signer.address.length - 5)}
                        </Text>
                        <Button colorPalette="green" onClick={() => setSigner(null)}>
                            로그아웃
                        </Button>
                    </Flex>
                    }
                </Box>
            </Flex>
        </Box>
    );
}
