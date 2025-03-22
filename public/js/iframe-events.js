window.addEventListener("message", (event) => {
    const isRpgMeetEvent = event.data.type === "rpgMeet";
    if (isRpgMeetEvent) {
        sendToServer("rpgMeet", {
            room_id: roomId,
            data: event.data,
        });
    }
    const isSetNicknameEvent = event.data.type === "setNickname";
    if (isSetNicknameEvent) {
        myPeerNickname = event.data.data;
        myVideoParagraph.innerText = myPeerNickname + " (me)";
        setPeerAvatarImgName("myVideoAvatarImage", myPeerNickname);
        setPeerAvatarImgName("myProfileAvatar", myPeerNickname);
        setPeerChatAvatarImgName("right", myPeerNickname);
        handleHideMe(isHideMeActive);
        sendToServer("peerNickname", {
            room_id: roomId,
            peer_id: myPeerId,
            peer_nickname: myPeerNickname,
        });
    }
});
