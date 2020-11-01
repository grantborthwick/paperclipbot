(() => {
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

    // Keep the price from changing more than once per second - this stabilizes the metrics somewhat
    window.priceCanChange = true;
    function holdPrice() {
        window.priceCanChange = false;
        var delay = -4.5 * margin + 1.225
        delay = 1000;
        setTimeout(() => window.priceCanChange = true, delay);
    }

    var extraOps, focus, phase;
    function initialize() {
        loadButtons();
        
        extraOps = operations > 1000 * memory;

        // todo: calculate rev or paperclip increase for each and figure out which helps more
        focus = margin > .05 ? "output" : "marketing";
        
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
                        accept = true;
                    }
                } else {
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

                        // Phase 2
                        case "Release the HypnoDrones":
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
                        case "Space Exploration":
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
                            accept = true;
                            break;

                        case "Memory release":
                            // Messed up :(
                            accept = true;
                            break;

                        default:
                            console.log(`Unknown project ${project.title}`)
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
    
    var probeDesignRunning = false;
    scheduleLoop("probeDesign", 1000, async () => {
        if (probeDesignRunning) {
            return;
        }
        
        probeDesignRunning = true;
        
        var speed = 0;
        var exploration = 0;
        var selfReplication = 0;
        var hazardRemediation = 0;
        var factoryProduction = 0;
        var harvesterDroneProduction = 0;
        var wireDroneProduction = 0;
        var combat = 0;
        for (var i = 0; i < probeTrust; ++i) {
            if (hazardRemediation < 5) {
                ++hazardRemediation;
            } else if (selfReplication < 7 && unusedClips > probeCost) {
                ++selfReplication;
            } else if (clipRate === 0 && availableMatter <= probeCost) {
                if (speed <= exploration) {
                    ++speed;
                } else {
                    ++exploration;
                }
            } else if (wire && factoryProduction === 0) {
                ++factoryProduction;
            } else if (acquiredMatter && wireDroneProduction === 0) {
                ++wireDroneProduction;
            } else if (availableMatter && harvesterDroneProduction === 0) {
                ++harvesterDroneProduction;
            } else if (btn.btnRaiseProbeCombat?.isVisible && drifterCount > probeCount / 100 && combat < Math.max(9, selfReplication * 3 / 4)) {
                ++combat;
            } else if (unusedClips > probeCost) {
                ++selfReplication;
            } else {
                ++combat;
            }
        }

        /* console.log(
            `speed: ${speed} | ` +
            `exploration: ${exploration} | ` +
            `selfReplication: ${selfReplication} | ` +
            `hazardRemediation: ${hazardRemediation} | ` +
            `factoryProduction: ${factoryProduction} | ` +
            `factoryProduction: ${factoryProduction} | ` +
            `harvesterDroneProduction: ${harvesterDroneProduction} | ` +
            `wireDroneProduction: ${wireDroneProduction} | ` +
            `combat: ${combat}`); */

        var data = [
            [speed,                    () => probeSpeed,  btn.btnRaiseProbeSpeed,  btn.btnLowerProbeSpeed],
            [exploration,              () => probeNav,    btn.btnRaiseProbeNav,    btn.btnLowerProbeNav],
            [selfReplication,          () => probeRep,    btn.btnRaiseProbeRep,    btn.btnLowerProbeRep],
            [hazardRemediation,        () => probeHaz,    btn.btnRaiseProbeHaz,    btn.btnLowerProbeHaz],
            [factoryProduction,        () => probeFac,    btn.btnRaiseProbeFac,    btn.btnLowerProbeFac],
            [harvesterDroneProduction, () => probeHarv,   btn.btnRaiseProbeHarv,   btn.btnLowerProbeHarv],
            [wireDroneProduction,      () => probeWire,   btn.btnRaiseProbeWire,   btn.btnLowerProbeWire],
            [combat,                   () => probeCombat, btn.btnRaiseProbeCombat, btn.btnLowerProbeCombat]
        ];
        var toLower = data.filter(x => x[0] < x[1]());
        var toRaise = data.filter(x => x[0] > x[1]());
        for ([desired, current, raise, lower] of toLower) {
            while (current() > desired && lower?.available) {
                lower.click();
            }
        }
        await delay(250);
        for ([desired, current, raise, lower] of toRaise) {
            while (current() < desired && raise?.available) {
                raise.click();
            }
        }
        probeDesignRunning = false;
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
            } else if (memory < 120) {
                console.log("Increasing memory");
                btn.btnAddMem?.click();
            } else if (processors <= memory * 2) {
                console.log("Increasing processors");
                btn.btnAddProc?.click();
            } else {
                console.log("Increasing memory");
                btn.btnAddMem?.click();
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
                } else if (margin > .02 && window.priceCanChange) {
                    console.log("Lowering price");
                    btn.btnLowerPrice?.click();
                    holdPrice();
                    return;
                }
            }

            if (window.priceCanChange) {
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
                if (btn.btnMakeMegaClipper?.available && wire > clipRate * 5) {
                    btn.btnMakeMegaClipper.click();
                    console.log("Making a MegaClipper")
                    return;
                } else if (!megaClipperFlag && btn.btnMakeClipper?.available && wire > clipRate * 5) {
                    btn.btnMakeClipper.click();
                    console.log("Making an AutoClipper")
                    return;
                }
            } else { // otherwise, focus on marketing
                if (btn.btnExpandMarketing?.available) {
                    btn.btnExpandMarketing.click();
                    console.log("Increasing marketing")
                    return;
                }
            }

            if (btn.btnImproveInvestments?.available && yomi > investUpgradeCost + 15000) {
                btn.btnImproveInvestments.click();
                console.log("Improving investments");
            }

            if (investStratElement.selectedIndex === 0) {
                investStratElement.selectedIndex = 2;
            }

            if (btn.btnInvest?.available && investLevel >= 5 && portTotal < clips / 10 && funds > 10000) {
                console.log("Investing");
                btn.btnInvest.click();
            }

            if (btn.btnWithdraw?.available && portTotal > clips * 4 && bankroll > 0 && bankroll < clips) {
                console.log("Divesting");
                btn.btnWithdraw.click();
            }
        }

        // Phase 1
        if (phase === 1) {
            var capacity = batteryLevel * batterySize / 100;
            var supply = farmLevel * farmRate / 100;
            if (availableMatter === 0 && acquiredMatter === 0 && wire === 0) {
                btn.btnFactoryReboot?.click();
                btn.btnWireDroneReboot?.click();
                btn.btnHarvesterReboot?.click();
                if (capacity > 100000) {
                    btn.btnBatteryReboot?.click();
                } else if (capacity < 100000) {
                    btn.btnMakeBattery.click();
                } else if (capacity === 100000) {
                    if (storedPower / 100 === capacity) {
                        btn.btnFarmReboot?.click();
                    } else {
                        btn.btnMakeFarm.click();
                    }
                }
            } else {
                var dDemand = (harvesterLevel * dronePowerRate/100) + (wireDroneLevel * dronePowerRate/100);
                var fDemand = (factoryLevel * factoryPowerRate/100);
                var demand = dDemand + fDemand;
                
                // Logic copied from acquireMatter()
                var matterRate = 0;
                if (availableMatter > 0) {
                    var dbsth = 1;
                    if (droneBoost>1){
                        dbsth = droneBoost * Math.floor(harvesterLevel);
                    }
                    var mtr = powMod * dbsth * Math.floor(harvesterLevel) * harvesterRate;
                    mtr = mtr * ((200 - sliderPos) / 100);
                    if (mtr > availableMatter){
                        mtr = availableMatter;
                    }
                    matterRate = mtr * 100;
                }

                // Logic copied from processMatter()
                var wireRate = 0;
                if (acquiredMatter > 0) {
                    var dbstw = 1;
                    if (droneBoost > 1) {
                        dbstw = droneBoost * Math.floor(wireDroneLevel);
                    }
                    var a = powMod * dbstw * Math.floor(wireDroneLevel) * wireDroneRate;
                    a = a * ((200 - sliderPos) / 100);
                    if (a > acquiredMatter) {
                        a = acquiredMatter;
                    }
                    wireRate = a * 100;
                }

                if (supply <= demand) {
                    if (btn.btnFarmx100?.available) {
                        console.log("Making 100 farms");
                        btn.btnFarmx100.click();
                    } else if (btn.btnFarmx10?.available) {
                        console.log("Making 10 farms");
                        btn.btnFarmx10.click();
                    } else if (btn.btnMakeFarm?.available) {
                        console.log("Making 1 farm");
                        btn.btnMakeFarm.click();
                    }
                } else if (capacity <= demand * 60) {
                    if (btn.btnBatteryx100?.available) {
                        console.log("Making 100 batteries");
                        btn.btnBatteryx100.click();
                    } else if (btn.btnBatteryx10?.available) {
                        console.log("Making 10 batteries");
                        btn.btnBatteryx10.click();
                    } else if (btn.btnMakeBattery?.available) {
                        console.log("Making 1 battery");
                        btn.btnMakeBattery.click();
                    }
                } else if (availableMatter === 0 || (clipRate <= wireRate && wire > 0)) {
                    if (btn.btnMakeFactory?.available) {
                        console.log("Making 1 factory");
                        btn.btnMakeFactory.click();
                    } else if (sliderElement.value < 200) {
                        sliderElement.value += 1
                    }
                } else if (wireRate <= matterRate && acquiredMatter > 0) {
                    if (btn.btnWireDronex1000?.available) {
                        console.log("Making 1000 wire drones");
                        btn.btnWireDronex1000.click();
                    } else if (btn.btnWireDronex100?.available) {
                        console.log("Making 100 wire drones");
                        btn.btnWireDronex100.click();
                    } else if (btn.btnWireDronex10?.available) {
                        console.log("Making 10 wire drones");
                        btn.btnWireDronex10.click();
                    } else if (btn.btnMakeWireDrone?.available) {
                        console.log("Making 1 wire drone");
                        btn.btnMakeWireDrone.click();
                    } else if (sliderElement.value > 0) {
                        sliderElement.value -= 1
                    }
                } else {
                    if (btn.btnHarvesterx1000?.available) {
                        console.log("Making 1000 harvester drones");
                        btn.btnHarvesterx1000.click();
                    } else if (btn.btnHarvesterx100?.available) {
                        console.log("Making 100 harvester drones");
                        btn.btnHarvesterx100.click();
                    } else if (btn.btnHarvesterx10?.available) {
                        console.log("Making 10 harvester drones");
                        btn.btnHarvesterx10.click();
                    } else if (btn.btnMakeHarvester?.available) {
                        console.log("Making 1 harvester drone");
                        btn.btnMakeHarvester.click();
                    } else if (sliderElement.value > 0) {
                        sliderElement.value -= 1
                    }
                }
            }
        }

        // Phase 2
        if (phase === 2) {
            // todo: make this better
            if (availableMatter === 0 && acquiredMatter === 0) {
                sliderElement.value = 200;
            } else {
                sliderElement.value = 0;
            }

            if (btn.btnIncreaseProbeTrust?.available) {
                console.log("Increasing probe trust");
                btn.btnIncreaseProbeTrust.click();
            }
            if (btn.btnIncreaseMaxTrust?.available) {
                console.log("Increasing max trust");
                btn.btnIncreaseMaxTrust.click();
            }
        }
    });
})();