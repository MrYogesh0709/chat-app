import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../../src/components/miscellaneous/SideDrawer";
import MyChats from "../../src/components/MyChats";
import ChatBox from "../../src/components/ChatBox";

const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const user = JSON.parse(localStorage.getItem("userInfo"));

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div style={{ width: "100%" }}>
      <SideDrawer />
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {<MyChats fetchAgain={fetchAgain} />}
        {<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};

export default ChatPage;
