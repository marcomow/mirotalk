window.addEventListener("message", (event) => {  
    const isRpgMeetEvent = event.data.type === "rpgMeet"; 
    if (isRpgMeetEvent) { 
        emitPeersAction(event.data);
    } 
    const isSetNicknameEvent = event.data.type === "setNickname";
    if (isSetNicknameEvent) {
        console.log(event)
        whoAreYouJoin(event.data.data);
    }
});
