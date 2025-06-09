window.addEventListener("message", (event) => {
    console.log({ event });
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
    const isOverlayEvent = event.data.type === "overlay";
    if (isOverlayEvent) {
        const overlayEvent = event.data.data;
        console.warn({ overlayEvent });
        const overlaySettings = overlayEvent.overlaySettings;
        sendToServer("overlay", {
            room_id: roomId,
            peer_id: myPeerId,
            data: overlayEvent,
        });
        tryUpdateOverlay("myVideoWrap", overlaySettings);
    }
});

const tryUpdateOverlay = (containerId, overlaySettings) => {
    const interval = setInterval(() => {
        const container = document.querySelector(`#${containerId}`);
        if (container) {
            clearInterval(interval);
            const oldWrapper = container.querySelector("[overlay-wrapper]");
            if (oldWrapper) oldWrapper.remove();

            const wrapper = document.createElement("div");
            wrapper.setAttribute("overlay-wrapper", "");
            container.appendChild(wrapper);
            updateOverlay(wrapper, overlaySettings);
        }
    }, 200);
};

const updateOverlay = (wrapper, overlaySettings) => {
    const OVERLAY_TABLE_SETTINGS = {
        rows: {
            defaultValue: 2,
            min: 0,
            max: 10,
        },
        columns: {
            defaultValue: 2,
            min: 0,
            max: 3,
        },
    };
    const {
        active,
        title,
        titleFontSize,
        subtitle,
        subtitleFontSize,
        mirror,
        rows = 0,
        columns = 0,
        tableFontSize,
        avatar,
    } = overlaySettings;
    if (!active) wrapper.remove();

    wrapper.className =
        `absolute bottom-0 left-0 right-0 grid grid-cols-12 grid-rows-12`;

    if (title) {
        const titleElement = wrapper.querySelector(".title") ||
            document.createElement("div");
        titleElement.className =
            "col-start-4 row-start-11 col-span-6 bg-black bg-opacity-50 text-white text-center font-bold flex flex-col justify-center notranslate";
        titleElement.style.fontSize = `${fontSizeInEm(titleFontSize)}em`;
        titleElement.innerText = title;
        wrapper.append(titleElement);
    }

    if (subtitle) {
        const subtitleElement = wrapper.querySelector(".subtitle") ||
            document.createElement("div");
        subtitleElement.className =
            "col-start-4 row-start-12 col-span-6 bg-black bg-opacity-50 text-white text-center font-bold flex flex-col justify-center notranslate";
        subtitleElement.style.fontSize = `${fontSizeInEm(subtitleFontSize)}em`;
        subtitleElement.innerText = subtitle;
        wrapper.append(subtitleElement);
    }
    wrapper.style.transform = mirror ? "scaleX(-1)" : "";

    // const arrayAppliedFilters = Object.keys(overlaySettings).filter((key: string): boolean => key.startsWith('filter-') && !!overlaySettings[key]);
    // if (arrayAppliedFilters.length > 0) {
    //     const stringFilter = arrayAppliedFilters.map((keyFilter: string) => {
    //         const filterType = keyFilter.replace('filter-', '');
    //         const filterValue = overlaySettings[keyFilter];
    //         const filterUnit = filterType === 'blur' ? 'px' : '%';
    //         return `${filterType}(${filterValue}${filterUnit})`
    //     }).join(' ');
    //     wrapper.style.filter = stringFilter;
    // }

    wrapper.querySelector("[table]")?.remove();

    if (rows > 0 && columns > 0) {
        const tableRows = rows;
        const tableColumns = columns;
        const tableElement = wrapper.querySelector("[table]") ||
            document.createElement("div");
        tableElement.setAttribute("table", "");
        const rowStart = OVERLAY_TABLE_SETTINGS.rows.max -
            tableRows +
            1;
        tableElement.className =
            `col-start-10 col-span-3 row-start-${rowStart} row-end-13 grid bg-white bg-opacity-80 text-black text-center font-bold rounded-t`;
        const tableFontSizeInEm = fontSizeInEm(tableFontSize);
        tableElement.style.gridTemplateRows = `repeat(${tableRows}, 1fr)`;
        tableElement.style.gridTemplateColumns = `repeat(${tableColumns}, 1fr)`;
        tableElement.innerHTML = "";
        for (let rowIndex = 0; rowIndex < tableRows; rowIndex++) {
            for (
                let columnIndex = 0;
                columnIndex < tableColumns;
                columnIndex++
            ) {
                const cellElement = document.createElement("div");
                cellElement.className =
                    "text-center flex flex-col justify-center notranslate";
                cellElement.innerText =
                    overlaySettings[`table_${rowIndex}_${columnIndex}`] || "";
                cellElement.style.fontSize = `${tableFontSizeInEm}em`;
                tableElement.append(cellElement);
            }
        }
        wrapper.append(tableElement);
    }

    if (avatar) {
        const avatarContainer = wrapper.querySelector(".avatar") ||
            document.createElement("div");
        avatarContainer.className =
            "col-start-1 row-start-1 col-span-3 row-span-12 grid";
        const avatarImage = avatarContainer.querySelector("img") ||
            document.createElement("img");
        avatarImage.src = avatar;
        avatarImage.className = "place-self-end";
        avatarContainer.append(avatarImage);
        // const avatarMaxSize = Math.min(wrapper.width, wrapper.height) / 4;
        // const avatarWidth = image.width < avatarMaxSize ? image.width : avatarMaxSize;
        // const avatarHeight = (image.height / image.width) * avatarWidth;
        // avatarImage.style.maxWidth = `${avatarWidth}px`;
        // avatarImage.style.maxHeight = `${avatarHeight}px`;
        wrapper.append(avatarContainer);
    }
};

const fontSizeInEm = (fontSizeInPx) => fontSizeInPx / 16;
