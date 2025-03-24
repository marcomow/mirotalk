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
    const isChangeLanguageEvent = event.data.type === "changeLanguage";
    if (isChangeLanguageEvent) {
        const tryInterval = setInterval(() => {
            try {
                setLanguage(event.data.language);
                clearInterval(tryInterval);
            } catch (err) {
                console.error(err);
            }
        }, 1000);
    }
});
