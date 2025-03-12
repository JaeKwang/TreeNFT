import { Flex } from "@chakra-ui/react";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import { ethers, JsonRpcSigner } from "ethers";
import { Contract } from "ethers";
import TreeTokenABI from "./abis/TreeNFTABI.json";
import Main from "./components/Main";

function App() {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [fruitTokenContract, setFruitTokenContract] = useState<Contract | null>(
    null
  );
  const [treeNFTContract, setTreeNFTContract] = useState<Contract | null>(null);

  useEffect(() => {
    if (!signer) return;

    setFruitTokenContract(
      new ethers.Contract(
        import.meta.env.VITE_RIFTY_TOKEN,
        TreeTokenABI,
        signer
      )
    );
    setTreeNFTContract(
      new ethers.Contract(import.meta.env.VITE_TREE_NFT, TreeTokenABI, signer)
    );
  }, [signer]);

  useEffect(() => console.log(fruitTokenContract), [fruitTokenContract]);
  useEffect(() => console.log(treeNFTContract), [treeNFTContract]);

  return (
    <>
      <Header signer={signer} setSigner={setSigner} />
      <Main />
    </>
  );
}

export default App;