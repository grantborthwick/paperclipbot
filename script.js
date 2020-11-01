(() => {
    window.btn = {};
    function loadButtons() {
        for (var button of document.getElementsByTagName("button")) {
            if (button.id) {
                if (!btn.hasOwnProperty(button.id)) {
                    console.log(`Found button ${button.id}`);
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
                btn[id].available = element.available === true && element.offsetParent !== null;
            } else {
                delete btn[id]
                console.log(`Button ${id} has been removed`);
            }
        }
    }
    loadButtons();

    // Keep the price from changing more than once per second - this stabilizes the metrics somewhat
    var priceCanChange = true;
    function holdPrice() {
        priceCanChange = false;
        var delay = -4.5 * margin + 1.225
        delay = 1000;
        setTimeout(() => priceCanChange = true, delay);
    }

    // We seem to be able to get more than one photonic chip if we accept these too fast, so adding a timeout
    var canAcceptJob = true;
    function holdJobs() {
        canAcceptJob = false;
        setTimeout(() => canAcceptJob = true, 1000);
    }

    function botLoop () {
        loadButtons();

        var extraOps = operations > 1000 * memory;
        var focus = margin > .05 ? "output" : "marketing"

        var phase = trust === 0 ? 1 : 0;

        if (btn.btnMakePaperclip?.available === true) {
            btn.btnMakePaperclip?.click();
        }

        if (btn.btnAddProc?.available === true) {
            if (processors < 6) {
                console.log("Increasing processors");
                btn.btnAddProc?.click();
            } else if (memory < 70) {
                console.log("Increasing memory");
                btn.btnAddMem?.click();
            } else if (processors <= memory) {
                console.log("Increasing processors");
                btn.btnAddProc?.click();
            } else {
                console.log("Increasing memory");
                btn.btnAddMem?.click();
            }
        }

        // Jobs
        if (canAcceptJob) {
            for (var project of activeProjects) {
                var projectButton = btn[project.id];
                if (projectButton?.available === true) {
                    var accept = false;
                    switch (project.title.trim()) {
                        case "Quantum Temporal Reversion": // We messed up
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
                            accept = false;
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
                            accept = investmentLevel >= 8;
                            break;

                        // Phase 2
                        case "Release the HypnoDrones":
                        case "Tóth Tubule Enfolding":
                        case "Power Grid":
                        case "Nanoscale Wire Production":
                        case "Harvester Drones":
                        case "Wire Drones":
                        case "Clip Factories":
                            accept = true;
                            break;

                        default:
                            console.log(`Unknown project ${project.title}`)
                    }
                    if (accept) {
                        console.log(`Accepting ${project.title.trim()}`);
                        projectButton.click();
                        holdJobs();
                        break;
                    }
                }
            }
        }

        // Quantum computing
        if (nextQchip) {
            if (nextQchip > 0) {
                // console.log(`Quantum: ${qChip0.value}`);
                var value = 0;
                qChips.forEach(chip => value += chip.value);
                if (value > 0) {
                    btn.btnQcompute.click();
                }
            }
        }

        // Tournaments
        if (btn.btnNewTournament?.available === true) {
            btn.btnNewTournament.click();
            // console.log("New tournament");
        } else if (stratPickerElement.selectedIndex === 0) {
            stratPickerElement.selectedIndex = 1;
        } else if (stratPickerElement.selectedIndex === 1 && stratPickerElement.children.length >= 5) {
            stratPickerElement.selectedIndex = 4;
        } else if (btn.btnRunTournament?.available === true) {
            btn.btnRunTournament.click();
            // console.log("New tournament");
        }

        // Phase 0
        if (phase === 0) {
            if (wire < clipRate * 10) { // Somehow this can be a decimal value
                if (btn.btnBuyWire?.available === true) {
                    console.log("Buying wire");
                    btn.btnBuyWire.click();
                    return
                } else if (margin > .02 && priceCanChange) {
                    console.log("Lowering price");
                    btn.btnLowerPrice?.click();
                    holdPrice();
                    return;
                }
            }

            if (priceCanChange) {
                if (clipRate === 0 || (clipRate > avgSales && margin > .02 && unsoldClips > clipRate * 30)) {
                    console.log("Lowering price");
                    btn.btnLowerPrice?.click();
                    holdPrice();
                    return;
                } else if (clipRate !== 0 && clipRate < avgSales || margin < .02 || unsoldClips < clipRate * 30) {
                    console.log("Raising price");
                    btn.btnRaisePrice?.click();
                    holdPrice();
                    return;
                }
            }

            // If we're selling really well, increase production
            if (focus === "output") {
                if (btn.btnMakeMegaClipper?.available === true && wire > clipRate * 5) {
                    btn.btnMakeMegaClipper.click();
                    console.log("Making a MegaClipper")
                    return;
                } else if (!megaClipperFlag && btn.btnMakeClipper?.available === true && wire > clipRate * 5) {
                    btn.btnMakeClipper.click();
                    console.log("Making an AutoClipper")
                    return;
                }
            } else { // otherwise, focus on marketing
                if (btn.btnExpandMarketing?.available === true) {
                    btn.btnExpandMarketing.click();
                    console.log("Increasing marketing")
                    return;
                }
            }

            if (btn.btnImproveInvestments?.available === true && yomi > investUpgradeCost + 15000) {
                btn.btnImproveInvestments.click();
                console.log("Improving investments");
            }

            if (investStratElement.selectedIndex === 0) {
                investStratElement.selectedIndex = 2;
            }

            if (btn.btnInvest?.available === true && investLevel >= 5 && portTotal < clips / 10 && funds > 10000) {
                console.log("Investing");
                btn.btnInvest.click();
            }

            if (btn.btnWithdraw?.available === true && portTotal > clips * 2 && bankroll > 0 && bankroll < clips) {
                console.log("Divesting");
                btn.btnWithdraw.click();
            }
        }

        // Phase 1
        if (phase === 1) {
            var supply = farmLevel * farmRate / 100;
            var dDemand = (harvesterLevel * dronePowerRate/100) + (wireDroneLevel * dronePowerRate/100);
            var fDemand = (factoryLevel * factoryPowerRate/100);
            var demand = dDemand + fDemand;

            if (supply <= demand) {
                if (btn.btnMakeFarm?.available === true && farmLevel === 0 || supply <= demand) {
                    console.log("Making 1 farm");
                    btn.btnMakeFarm.click();
                }
            } else {
                var capacity = batteryLevel * batterySize / 100;
                if (btn.btnMakeBattery?.available === true && (batteryLevel === 0 || capacity < demand * 60)) {
                    console.log("Making 1 battery");
                    btn.btnMakeBattery.click();
                } else {
                    if (btn.btnMakeHarvester?.available === true && harvesterLevel === 0) {
                        console.log("Making 1 harvester");
                        btn.btnMakeHarvester.click();
                    }
                    if (btn.btnMakeHarvester?.available === true && harvesterLevel === 0) {
                        console.log("Making 1 harvester drone");
                        btn.btnMakeHarvester.click();
                    }
                    if (btn.btnMakeWireDrone?.available === true && wireDroneLevel === 0) {
                        console.log("Making 1 wire drone");
                        btn.btnMakeWireDrone.click();
                    }
                    if (btn.btnMakeFactory?.available === true && factoryLevel === 0) {
                        console.log("Making 1 factory");
                        btn.btnMakeFactory.click();
                    }
                }
            }
        }
        
        return;
    }

    var timeout = 10;
    if (window.runId) {
        clearInterval(runId);
    }
    window.runId = setInterval(botLoop, timeout);  
})();