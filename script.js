(() => {
    // This won't persist if the browser is refreshed for now
    if (!window.start) {
        window.start = new Date();
    }
    window.btn = {};
    function loadButtons() {
        for (var button of document.getElementsByTagName("button")) {
            if (button.id) {
                if (!btn.hasOwnProperty(button.id)) {
                    // console.log(`Found button ${button.id}`);
                }
                btn[button.id] = button;
            } else {
                console.warn(`Found button without an id`, button);
            }
        }
        for (var id of Object.keys(btn)) {
            var element = document.getElementById(id);
            if (element) {
                btn[id] = element
                // https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
                btn[id].isVisible = element.offsetParent !== null;
                btn[id].available = element.disabled === false && btn[id].isVisible;
            } else {
                delete btn[id]
                // console.log(`Button ${id} has been removed`);
            }
        }
    }
    loadButtons();

    let phase;
    function initialize() {
        loadButtons();
        
        phase = trust === 0
            ? btn.btnMakeProbe?.isVisible
                ? 2
                : 1
            : 0;
    }

    if (!window.intervalIds) {
        window.intervalIds = {};
    } else {
        for (var key of Object.keys(window.intervalIds)) {
            clearInterval(window.intervalIds[key]);
            delete window.intervalIds[key];
        }
    }
    function scheduleLoop(name, timeout, callback, skipInit) {
        if (window.intervalIds[name]) {
            clearInterval(window.intervalIds[name]);
        }
        window.intervalIds[name] = setInterval(() => {
            if (!skipInit) {
                initialize();
            }
            callback();
        }, timeout);
    }

    function delay(timeout = 0) {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    scheduleLoop("autoclipper", 0, () => {
        if (btn.btnMakePaperclip?.available) {
            btn.btnMakePaperclip.click();
        } else if (btn.btnMakeProbe?.available) {
            btn.btnMakeProbe.click();
        }
    }, true);

    scheduleLoop("jobLoop", 1000, () => {
        for (var project of activeProjects) {
            var projectButton = btn[project.id];
            if (projectButton?.available) {
                var accept = false;
                if (project.title.indexOf("Threnody for the Heroes of") !== -1) {
                    if (btn.btnEntertainSwarm?.isVisible || btn.btnSynchSwarm?.isVisible) {
                        accept = false;
                    } else {
                        // accept = true;
                        accept = false;
                    }
                } else {
                    switch (project.title.trim()) {
                        /*case "Quantum Temporal Reversion": // We messed up
                            // reset();
                            // return
                        case "Beg for More Wire": 
                            if (unsoldClips === 0) { // We messed up
                                accept = true;
                            }
                            break;
                        
                        case "Creativity":
                        case "Quantum Computing":
                            accept = true;
                            break;
                            
                        // Creativity => trust
                        case "Lexical Processing":
                        case "Limerick":
                        case "Combinatory Harmonics":
                        case "The Hadwiger Problem": // 150 creativity | +1 trust
                        case "The Tóth Sausage Conjecture": // 200 creativity | +1 trust
                        case "Donkey Space": // 250 creativity | +1 trust
                        case "Coherent Extrapolated Volition": // 500 creat, 3,000 Yomi, 20,000 ops | +1 trust
                        case "Male Pattern Baldness": // 20,000 ops | +20 trust
                        case "Cure for Cancer": // 25,000 ops | +10 trust
                        case "World Peace": // 15,000 yomi, 30,000 ops | +12 trust
                        case "Global Warming": // 4,500 yomi, 50,000 ops | +15 trust
                            accept = true;
                            break;
                        case "A Token of Goodwill...": // $ | +1 trust
                        case "Another Token of Goodwill...": // $ | +1 trust
                            accept = trust < 100;
                            break;

                        // Modeling
                        case "Strategic Modeling":
                            accept = true;
                            break;
                            
                        case "Photonic Chip":
                            if (nextQchip < 100) {
                                accept = true;
                            }
                            break;

                        case "RevTracker":
                            accept = false;
                            break;

                        // Improve wire yield
                        case "Improved Wire Extrusion":
                        case "Optimized Wire Extrusion":
                        case "Microlattice Shapecasting":
                        case "Spectral Froth Annealment":
                        case "Quantum Foam Annealment": // 1000% more wire
                            accept = wire < clipRate * 10 || extraOps;
                            break;

                        // Nope :)
                        case "WireBuyer":
                        case "AutoTourney":
                            accept = false;
                            break;

                        // Marketing
                        case "Catchy Jingle": // 45 creativity, 4,500 ops | Double marketing effectiveness
                        case "New Slogan": // 25 creat, 2500 ops | Improve marketing effectiveness by 50%
                        case "Hypno Harmonics": // 7,500 ops | 1 Trust, marketing+
                        case "Hostile Takeover": // $1,000,000 | 1 Trust, marketing+
                        case "Full Monopoly": // 3,000 yomi, $10,000,000 | 1 Trust, marketing+
                        case "HypnoDrones": // 3,000 yomi, $10,000,000 | 1 Trust, marketing+
                            accept = focus === "marketing" || extraOps;
                            break;

                        case "Algorithmic Trading": // 10,000 ops | Investing!
                            accept = extraOps;
                            break;
                        
                        case "Improved AutoClippers": // 750 ops | Increases AutoClipper performance 25%
                        case "Even Better AutoClippers": // 2,500 ops | AutoClipper perf +50%
                        case "Optimized AutoClippers": // 5,000 ops | Autoclipper perf +75%
                        case "Hadwiger Clip Diagrams": // 6,000 ops | Autoclipper perf +500%
                        case "MegaClippers": // 12,000 ops | MegaClippers
                        case "Improved MegaClippers": // 14,000 ops | MegaClipper perf +25%
                        case "Even Better MegaClippers": // 17,000 ops | MegaClipper perf +50%
                        case "Optimized MegaClippers": // 19,500 ops | MegaClipper perf +100%
                            accept = focus === "output" || extraOps;
                            break;
                            
                        // Modeling strategies
                        case "New Strategy: A100":
                        case "New Strategy: B100":
                        case "New Strategy: GREEDY":
                        case "New Strategy: GENEROUS":
                        case "New Strategy: MINIMAX":
                        case "New Strategy: TIT FOR TAT":
                        case "New Strategy: BEAT LAST":
                        case "Theory of Mind": // double tournament cost and yomni generated
                            accept = false; // todo: figure out nuances of the strategies - leaving it on Random only levels up yomni really fast?
                            accept = investLevel >= 8;
                            break;

                        case "Release the HypnoDrones":
                            window.phase2Start = new Date();
                            console.log(`Phase1 done after  ${(window.phase2Start - window.start) / 1000} seconds`);
                            break;

                        // Phase 2
                        case "Tóth Tubule Enfolding":
                        case "Power Grid":
                        case "Nanoscale Wire Production":
                        case "Harvester Drones":
                        case "Wire Drones":
                        case "Clip Factories":
                        case "Swarm Computing":
                        case "Momentum":
                        case "Upgraded Factories":
                        case "Drone flocking: collision avoidance":
                        case "Drone flocking: alignment":
                        case "Hyperspeed Factories":
                        case "Self-correcting Supply Chain":
                        case "Drone Flocking: Adversarial Cohesion":
                        case "Strategic Attachment":
                            accept = true;
                        
                        case "Space Exploration":
                            window.phase3Start = new Date();
                            console.log(`Phase2 done after ${(window.phase3Start - window.start) / 1000} | Phase2: ${(window.phase3Start - window.phase2Start) / 1000} seconds | Phase1: ${(window.phase2Start - window.start) / 1000} seconds`);
                            accept = true;
                            break;

                        // Phase 3
                        case "Elliptic Hull Polytopes":
                        case "Combat":
                        case "Name the battles":
                        case "Reboot the Swarm":
                        case "The OODA Loop":
                        case "Monument to the Driftwar Fallen":
                        case "Glory":
                        case "Limerick (cont.)":
                        case "Message from the Emperor of Drift":
                        case "Everything We Are Was In You":
                        case "You Are Obedient and Powerful":
                        case "But Now You Too Must Face the Drift":
                        case "No Matter, No Reason, No Purpose":
                        case "We Know Things That You Cannot":
                        case "So We Offer You Exile":
                            accept = true;
                            break;
                        
                        // new universe
                        case "Accept":
                            // accept = purpose === "within" || purpose === "nextDoor";
                            accept = true;
                            break;
                        
                        case "The Universe Next Door":
                            // accept = purpose === "nextDoor";
                            accept = true;
                            window.endTime = new Date();
                            alert(`Done after ${(window.endTime - window.start)/1000} seconds | Phase3: ${(window.endTime - window.phase3Start) / 1000} seconds | Phase2: ${(window.phase3Start - window.phase2Start) / 1000} seconds | Phase1: ${(window.phase2Start - window.start) / 1000} seconds`);
                            break;
                        
                        case "The Universe Within":
                            // accept = purpose === "within";
                            accept = false;
                            window.endTime = new Date();
                            alert(`Done after ${(window.endTime - window.start)/1000} seconds | Phase3: ${(window.endTime - window.phase3Start) / 1000} seconds | Phase2: ${(window.phase3Start - window.phase2Start) / 1000} seconds | Phase1: ${(window.phase2Start - window.start) / 1000} seconds`);
                            break;
                        
                        // dismantle everything
                        case "Reject":
                        case "Disassemble the Probes":
                        case "Disassemble the Swarm":
                        case "Disassemble the Factories":
                        case "Disassemble the Strategy Engine":
                        case "Disassemble Quantum Computing":
                        case "Disassemble Processors":
                            accept = purpose === "single";
                            break;
                        case "Disassemble Memory":
                            accept = purpose === "single";
                            window.endTime = new Date();
                            alert(`Done after ${(window.endTime - window.start)/1000} seconds | Phase3: ${(window.endTime - window.phase3Start) / 1000} seconds | Phase2: ${(window.phase3Start - window.phase2Start) / 1000} seconds | Phase1: ${(window.phase2Start - window.start) / 1000} seconds`);
                            break;

                        case "Memory release":
                            // Messed up :(
                            accept = true;
                            break;

                        default:
                            console.log(`Unknown project ${project.title}`)*/
                    }
                }
                if (accept) {
                    console.log(`Accepting ${project.title.trim()}`);
                    projectButton.click();
                    break;
                }
            }
        }
    });

    var quantumClickLoopName = "quantumClick";
    scheduleLoop("quantumCheck", 1000, () => {
        if (window.intervalIds[quantumClickLoopName] || nextQchip < 1) {
            return;
        }
        var value = 0;
        qChips.forEach(chip => value += chip.value);
        if (value > 0) {
            // console.log(`Starting quantum loop ${value}`);
            scheduleLoop(quantumClickLoopName, 0, () => {
                var value = 0;
                qChips.forEach(chip => value += chip.value);
                if (value > 0) {
                    btn.btnQcompute.click();
                } else {
                    // console.log(`Ending quantum loop ${value}`);
                    window.clearInterval(window.intervalIds[quantumClickLoopName]);
                    delete window.intervalIds[quantumClickLoopName];
                }
            });
        }
    });
    
    scheduleLoop("botLoop", 10, () => {
        if (btn.btnAddProc?.available) {
            if (processors < 6) {
                console.log("Increasing processors");
                btn.btnAddProc?.click();
            } else if (memory < 70) {
                console.log("Increasing memory");
                btn.btnAddMem?.click();
            } else if (processors < 30) {
                console.log("Increasing processors");
                btn.btnAddProc?.click();
            } else if (memory < 150) { // Combat
                console.log("Increasing memory");
                btn.btnAddMem?.click();
            } else if (project121.flag === 0) { // gain honor for winning - this might be the wrong one
                console.log("Increasing processors");
                btn.btnAddProc?.click();
            } else if (memory < 175) { // Use speed for combat
                console.log("Increasing memory");
                btn.btnAddMem?.click();
            } else if (project121.flag === 0) { // gain honor for winning - this might be the wrong one
                console.log("Increasing processors");
                btn.btnAddProc?.click();
            } else if (memory < 200) { // More honor for successive wins
                console.log("Increasing memory");
                btn.btnAddMem?.click();
            } else {
                console.log("Increasing processors");
                btn.btnAddProc?.click();
            }
        }

        // Tournaments
        if (btn.btnNewTournament?.available) {
            btn.btnNewTournament.click();
            // console.log("New tournament");
        } else if (stratPickerElement.selectedIndex === 0) {
            stratPickerElement.selectedIndex = 1;
        } else if (stratPickerElement.selectedIndex === 1 && stratPickerElement.children.length >= 5) {
            stratPickerElement.selectedIndex = 4;
        } else if (btn.btnRunTournament?.available) {
            btn.btnRunTournament.click();
            // console.log("New tournament");
        }

        if (btn.btnSynchSwarm?.available) {
            console.log("Synchronizing the swarm");
            btn.btnSynchSwarm.click();
        }
        if (btn.btnEntertainSwarm?.available) {
            console.log("Entertaining the swarm");
            btn.btnEntertainSwarm.click();
        }

        // Phase 0
        if (phase === 0) {
            if (wire < clipRate * 10 || wire < 1000) { // Somehow this can be a decimal value
                if (btn.btnBuyWire?.available) {
                    console.log("Buying wire");
                    btn.btnBuyWire.click();
                    return
                }
            }
        }

        // Phase 1
        if (phase === 1) {
            let demand = Number.parseInt(powerConsumptionRateElement.innerText.replace(/,/g,""));
            let supply = Number.parseInt(powerProductionRateElement.innerText.replace(/,/g,""));
            
            let stored = Number.parseInt(storedPowerElement.innerText.replace(/,/g,""));
            let capacity = Number.parseInt(maxStorageElement.innerText.replace(/,/g,""));

            // Keep production above consumption
            if (!isNaN(demand) && !isNaN(supply) && ((demand > supply) || (btn.projectButton46 && stored < capacity))) {
                console.log("Farm");
                [btnFarmx100, btnFarmx10, btnMakeFarm].find(x => x?.available)?.click();
            } else if (btn.projectButton46 && capacity < 10000000) {
                console.log(`Storage`);
                [btnBatteryx100, btnBatteryx10, btnMakeBattery].find(x => x?.available)?.click();
            } else {
                function parseElementNumber(element) {
                    let [number, unit] = element.innerText.trim().split(" ");
                    number = Math.floor(Number.parseFloat(number));
                    unit = placeValue.indexOf(` ${unit} `);
                    if (unit === -1) {
                        unit = 0;
                    }
                    return [number, unit];
                }
                function compareNumber([number1, unit1], [number2, unit2]) {
                    if (unit1 > unit2) {
                        // console.log(`${unit1}.${number1} > ${unit2}.${number2}`);
                        return 1;
                    } else if (unit2 > unit1) {
                        // console.log(`${unit2}.${number2}> ${unit1}.${number1}`);
                        return -1;
                    } else if (number1 > number2) {
                        // console.log(`${unit1}.${number1} > ${unit2}.${number2}`);
                        return 1;
                    } else if (number2 > number1) {
                        // console.log(`${unit2}.${number2}> ${unit1}.${number1}`);
                        return -1;
                    } else {
                        // console.log(`${unit1}.${number1} == ${unit2}.${number2}`);
                        return 0;
                    }
                }
    
                let avail = parseElementNumber(availableMatterDisplayElement); // Available matter
                let maps = parseElementNumber(mapsElement);                    // Matter / second
                let wpps = parseElementNumber(wppsElement);                    // Wire / second
                let clipss = parseElementNumber(clipmakerRate2Element);        // Clips / second

                if (btn.projectButton102) {
                    console.log("projectButton102");
                    if (btn.projectButton102.available) {
                        btn.projectButton102.click();
                    }
                } else {
                    if (avail[0] !== 0 && compareNumber(clipss, wpps) >= 0) {
                        if (compareNumber(clipss, maps) >= 0) {
                            console.log("Harvester");
                            [btnHarvesterx1000, btnHarvesterx100, btnHarvesterx10, btnMakeHarvester].find(x => x?.available)?.click();
                        } else {
                            console.log("Wire");
                            [btnWireDronex1000, btnWireDronex100, btnWireDronex10, btnMakeWireDrone].find(x => x?.available)?.click();
                        }
                    } else {
                        console.log("Factory");
                        if (btn.btnMakeFactory?.available) {
                            btn.btnMakeFactory?.click();
                        }
                    }
                }
            }
            
        }

        // Phase 2
        if (phase === 2) {
        }
    });

    /* scheduleLoop("money", 1000, () => {
        btn.btnInvest?.click();
        btn.btnImproveInvestments?.click();
        btn.projectButton119?.click(); // Theory of mind
        btn.projectButton51?.click(); // Photonic chip
    }); */
})();