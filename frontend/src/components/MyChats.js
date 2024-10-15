import React, { useEffect, useState, useContext } from 'react';
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import ChatContext from "../Context/chat-context";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = useContext(ChatContext);

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      const { data } = await axios.get("https://team-collaboration-chat.onrender.com/api/chat", config);
      setChats(data);
      console.log(data, 'fetching all users chats in my chats');

    } catch (error) {

      console.log(error.message);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };



  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInformation"))); //chatLogics 
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box d="flex" w="100%" justifyContent="space-between" alignItems="center">
        <Text fontSize="20px" fontWeight="bold">My Chats</Text>
        <GroupChatModal>
          <Button rightIcon={<AddIcon />}>New Group Chat</Button>
        </GroupChatModal>
      </Box>
      <Box d="flex" flexDir="column" p={3} bg="#F8F8F8" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
              >
                <Text>{!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}</Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
