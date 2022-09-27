function run() {
    console.log(`here: ${document.readyState} | ${window.top.ticks}`);
    if (document.readyState !== "complete") {
        setTimeout(run, 100);
        return;
    }

    if (!window.ticks) {
        /* https:/*stackoverflow.com/questions/20499994/access-window-variable-from-content-script */
        var th = document.getElementsByTagName("head")[0];
        var s = document.createElement('script');
        s.setAttribute('type', 'text/javascript');
        s.innerText = `${run.toString().replace(/\n/g, "\r\n")}; run();`;
        th.appendChild(s);
        return;
    }

    if (window.loopId) {
        clearInterval(window.loopId);
    }
    if (window.loopId) {
        clearInterval(window.slowLoopId);
    }
    if (window.loopId) {
        clearInterval(window.slowestLoopId);
    }
    /* Phase 1
    var btnBuyWire = document.getElementById("btnBuyWire");
    var btnAddProc = document.getElementById("btnAddProc");
    var btnAddMem = document.getElementById("btnAddMem");
    var btnQcompute = document.getElementById("btnQcompute");
    var btnNewTournament = document.getElementById("btnNewTournament");
    var btnRunTournament = document.getElementById("btnRunTournament");
    var btnExpandMarketing = document.getElementById("btnExpandMarketing");
    var btnMakeClipper = document.getElementById("btnMakeClipper");
    var btnMakeMegaClipper = document.getElementById("btnMakeMegaClipper");

    var btnLowerPrice = document.getElementById("btnLowerPrice");
    var btnRaisePrice = document.getElementById("btnRaisePrice");

    var btnInvest = document.getElementById("btnInvest");
    var btnWithdraw = document.getElementById("btnWithdraw");
    var btnImproveInvestments = document.getElementById("btnImproveInvestments");
    var investStrat = document.getElementById("investStrat");

    /* Phase 2 */
    var btnMakeFarm = document.getElementById("btnMakeFarm");
    var btnFarmx10 = document.getElementById("btnFarmx10");
    var btnFarmx100 = document.getElementById("btnFarmx100");

    var btnMakeBattery = document.getElementById("btnMakeBattery");
    var btnBatteryx10 = document.getElementById("btnBatteryx10");
    var btnBatteryx100 = document.getElementById("btnBatteryx100");

    var btnMakeHarvester = document.getElementById("btnMakeHarvester");
    var btnHarvesterx10 = document.getElementById("btnHarvesterx10");
    var btnHarvesterx100 = document.getElementById("btnHarvesterx100");
    var btnHarvesterx1000 = document.getElementById("btnHarvesterx1000");

    var btnMakeWireDrone = document.getElementById("btnMakeWireDrone");
    var btnWireDronex10 = document.getElementById("btnWireDronex10");
    var btnWireDronex100 = document.getElementById("btnWireDronex100");
    var btnWireDronex1000 = document.getElementById("btnWireDronex1000");

    var btnMakeFactory = document.getElementById("btnMakeFactory");

    var btnFactoryReboot = document.getElementById("btnFactoryReboot");
    var btnHarvesterReboot= document.getElementById("btnHarvesterReboot");
    var btnWireDroneReboot = document.getElementById("btnWireDroneReboot");

    var slider = document.getElementById("slider");

    /* Phase 3 */
    var btnMakeProbe = document.getElementById("btnMakeProbe");
    var btnIncreaseProbeTrust = document.getElementById("btnIncreaseProbeTrust");
    var btnIncreaseMaxTrust = document.getElementById("btnIncreaseMaxTrust");
    var btnEntertainSwarm = document.getElementById("btnEntertainSwarm");
    var btnSynchSwarm = document.getElementById("btnSynchSwarm");

    var btnLowerProbeSpeed = document.getElementById("btnLowerProbeSpeed");
    var btnRaiseProbeSpeed = document.getElementById("btnRaiseProbeSpeed");
    var btnLowerProbeNav = document.getElementById("btnLowerProbeNav");
    var btnRaiseProbeNav = document.getElementById("btnRaiseProbeNav");
    var btnLowerProbeRep = document.getElementById("btnLowerProbeRep");
    var btnRaiseProbeRep = document.getElementById("btnRaiseProbeRep");
    var btnLowerProbeHaz = document.getElementById("btnLowerProbeHaz");
    var btnRaiseProbeHaz = document.getElementById("btnRaiseProbeHaz");
    var btnLowerProbeFac = document.getElementById("btnLowerProbeFac");
    var btnRaiseProbeFac = document.getElementById("btnRaiseProbeFac");
    var btnLowerProbeHarv = document.getElementById("btnLowerProbeHarv");
    var btnRaiseProbeHarv = document.getElementById("btnRaiseProbeHarv");
    var btnLowerProbeWire = document.getElementById("btnLowerProbeWire");
    var btnRaiseProbeWire = document.getElementById("btnRaiseProbeWire");
    var btnLowerProbeCombat = document.getElementById("btnLowerProbeCombat");
    var btnRaiseProbeCombat = document.getElementById("btnRaiseProbeCombat");

    var combatProject = projects.filter(x => x.title == "Combat ")[0];

    var doNotEntertain = false;

    /* Common */
    var btnMakePaperclip = document.getElementById("btnMakePaperclip");
    var stratPicker = document.getElementById("stratPicker");
    function loop() {
        if (!btnAddProc.disabled) {
            if (processors < 6) {
                btnAddProc.click();
            } else if (memory < 40) { /* when playing normally, would usually go with 70, but quantum can get us a lot higher */
                btnAddMem.click();
            } else if (processors < memory || (memory >= 60 && processors < 400)) {
                btnAddProc.click();
            } else {
                btnAddMem.click();
            }
        }
        if (!btnQcompute.disabled) {
            var q = 0;
            for (var i = 0; i< qChips.length; i++){
                if (qChips[i].active) {
                    q = q+qChips[i].value;
                }
            }
            if (q > 0) {
                btnQcompute.click();
            }
        }

        /* First priority projects if available */
        var projectTarget = null;
        var targetMoney = 0;
        var targetClips = 0;
        for (var project of activeProjects) {
            switch (project.title.trim()) {
                case "Creativity": /* todo: fix not running trust increasing ones */
                case "Quantum Computing":
                case "Tóth Tubule Enfolding":
                case "Power Grid":
                case "Nanoscale Wire Production":
                case "Harvester Drones":
                case "Wire Drones":
                case "Clip Factories":
                case "Swarm Computing":
                case "Momentum":
                case "Upgraded Factories":
                case "Hyperspeed Factories":
                case "Drone flocking: collision avoidance":
                case "Drone flocking: alignment":
                case "Drone Flocking: Adversarial Cohesion":
                case "Space Exploration":
                case "Elliptic Hull Polytopes":
                case "Combat":
                /* + trust */
                case "Limerick":
                case "Lexical Processing":
                case "Combinatory Harmonics":
                case "The Hadwiger Problem":
                case "The Tóth Sausage Conjecture":
                case "Donkey Space":
                    projectTarget = project;
                    break;
                case "Self-correcting Supply Chain":
                    projectTarget = project;
                    targetClips = 1000000000000000000000;
                    break;
                case "Hostile Takeover":
                case "Full Monopoly":
                case "A Token of Goodwill...":
                case "Another Token of Goodwill...":
                    targetMoney = Number(project.priceTag.replace(/[\(\)\$, ](.* yomi)?/g, ""));
                    if (funds + bankroll >= targetMoney) {
                        projectTarget = project;
                    }
                    break;
                case "Photonic Chip": 
                    projectTarget = !qChips[0].active || !project.element.disabled ? project : null;
                    break;
            }
        }
        /* Secondary priority projects */
        doNotEntertain = false;
        if (!projectTarget) {
            for (var project of activeProjects) {
                switch (project.title.trim().replace(/Threnody.*/g,"Threnody")) {
                    /* Other improvements */
                    case "Improved Wire Extrusion":
                    case "Algorithmic Trading":
                    case "New Slogan":
                    case "Catchy Jingle":
                    case "Hadwiger Clip Diagrams":
                    case "Hypno Harmonics":
                    case "Optimized Wire Extrusion":
                    case "Microlattice Shapecasting":
                    case "Spectral Froth Annealment":
                    case "Quantum Foam Annealment":
                    case "HypnoDrones":
                    case "Coherent Extrapolated Volition":
                    case "Cure for Cancer":
                    case "World Peace":
                    case "Global Warming":
                    case "Male Pattern Baldness":
                    /* Autoclippers */
                    case "Improved AutoClippers":
                    case "Even Better AutoClippers":
                    case "Optimized AutoClippers":
                    case "MegaClippers":
                    case "Improved MegaClippers":
                    case "Even Better MegaClippers":
                    case "Optimized MegaClippers":
                    /* Strategic modeling */
                    case "Strategic Modeling":
                    case "New Strategy: A100":
                    case "New Strategy: B100":
                    case "New Strategy: GREEDY":
                    case "New Strategy: GENEROUS":
                    case "New Strategy: MINIMAX":
                    case "New Strategy: TIT FOR TAT":
                    case "New Strategy: BEAT LAST":
                    case "Theory of Mind":
                    case "Strategic Attachment":
                    case "Release the HypnoDrones":
                    /* Level 3 */
                    case "The OODA Loop":
                    case "Reboot the Swarm":
                    case "Glory":
                    case "Monument to the Driftwar Fallen":
                    case "Message from the Emperor of Drift":
                    case "Everything We Are Was In You":
                    case "You Are Obedient and Powerful":
                    case "But Now You Too Must Face the Drift":
                    case "No Matter, No Reason, No Purpose":
                    case "We Know Things That You Cannot":
                    case "So We Offer You Exile":
                    case "The Universe Next Door":
                    case "Accept":
                        if (!project.element.disabled) {
                            if (project.title.trim() !== "Release the HypnoDrones" || clips > 121000000) {
                                projectTarget = project
                            }
                        }
                        break;
                    case "Name the battles":
                        doNotEntertain = true;
                        if (!project.element.disabled) {
                            projectTarget = project
                        }
                        break;
                    case "Threnody":
                        if (yomi > 1000000 && !project.element.disabled) {
                            projectTarget = project
                        }
                        break;
                }
            }
        }
        if (projectTarget) {
            if (!projectTarget.element.disabled) {
                projectTarget.element.click();
                console.log(`Triggering ${projectTarget.title}`);
            }
        }
        
        if (!btnNewTournament.disabled && yomiDisplayElement.checkVisibility()) {
            stratPicker.selectedIndex = stratPicker.children.length - 1;
            console.log("Starting tournament");
            btnNewTournament.click();
        } else if (!btnRunTournament.disabled) {
            console.log("Running tournament");
            btnRunTournament.click();
        }

        
        if (humanFlag) { /* Phase 1 */
            if (!btnMakePaperclip.disabled) {
                btnMakePaperclip.click();
            }
            if (wire < 1000 && !btnBuyWire.disabled) {
                btnBuyWire.click();
            }
            
            var oneClipperRate = clipperBoost / 100;
            var oneMegaClipperRate = megaClipperBoost * 5 * megaClipperFlag;

            var cFps = 100;
            var sFps = 10;
            var cps = (clipmakerLevel * oneClipperRate + oneMegaClipperRate * megaClipperLevel) * cFps;
            if (wire < 1) {
                cps = 0;
            }
            var calcCsps = (change) => {
                return (margin + change > 0)
                    ? Math.floor(.7 * Math.pow(window.demand * margin / (margin + change), 1.15)) * sFps
                    : 0;
            };
            var csps = calcCsps(0);
            var cspsU = calcCsps(.01);
            var cspsD = calcCsps(-.01);
            /* console.log(`${cps} | ${cspsD} < ${csps} < ${cspsU}`); */
            if ((clipRate > cspsD || wire < 1 && margin > .05) && unsoldClips > clipRate * 4) {
                console.debug(`Lowering price | ${clipRate} | ${cspsD} < ${csps} < ${cspsU} | wire: ${wire}`);
                btnLowerPrice.click();
                return;
            } else if ((clipRate < cspsU && wire > 1) || unsoldClips < clipRate * 4) {
                console.debug(`Raising price | ${clipRate} | ${cspsD} < ${csps} < ${cspsU} | wire: ${wire}`);
                btnRaisePrice.click();
                return;
            }

            if (margin < 0.05 || clipperCost > adCost) {
                if (!btnExpandMarketing.disabled) {
                    console.log("Upgrading marketing");
                    btnExpandMarketing.click();
                }
            } else if (wire > 1 && (!btnMakeMegaClipper.disabled || !btnMakeClipper.disabled)) {
                var cRatio = oneClipperRate / clipperCost;
                var mcRatio = oneMegaClipperRate / megaClipperCost;
                if (cRatio > mcRatio) {
                    if (!btnMakeClipper.disabled) {
                        console.log("Creating clipper");
                        btnMakeClipper.click();
                    }
                } else {
                    if (!btnMakeMegaClipper.disabled) {
                        console.log("Creating mega clipper");
                        btnMakeMegaClipper.click();
                    }
                }
            }

            if (investmentEngineFlag) {
                if (!btnImproveInvestments.disabled) {
                    console.log("Improving investments");
                    btnImproveInvestments.click();
                }

                if (targetMoney && bankroll > targetMoney)
                {
                    console.log("Withdrawing");
                    btnWithdraw.click();
                } else {
                    if (investLevel > 1 && funds > bankroll) {
                        investStrat.selectedIndex = investStrat.children.length - 1;

                        console.log("Investing");
                        btnInvest.click();
                    }
                }
            }
        } else if (!spaceFlag) { /* Phase 2 */
            if (!btnMakePaperclip.disabled) {
                btnMakePaperclip.click();
            }
            if (!targetClips) {
                /* todo: fix phase 2 factory, harvester, and wire drone initial build */
                var supply = farmLevel * farmRate/100;
                var cap = batteryLevel * batterySize;
                var dDemand = (harvesterLevel * dronePowerRate/100) + (wireDroneLevel * dronePowerRate/100);
                var fDemand = (factoryLevel * factoryPowerRate/100);
                var demand = dDemand + fDemand;
                if (supply <= demand && (farmLevel === 0 || (factoryLevel > 0 && harvesterLevel > 0 && wireDroneLevel > 0))) {
                    if (!btnFarmx100.disabled) {
                        console.log("Creating 100 farms");
                        btnFarmx100.click();
                    } else if (!btnFarmx10.disabled) {
                        console.log("Creating 10 farms");
                        btnMakeFarm.click();
                    } else if (!btnMakeFarm.disabled) {
                        console.log("Creating farm");
                        btnMakeFarm.click();
                    }
                } else if ((cap < supply * 2000 && (batteryLevel === 0 || factoryLevel > 0)) || (availableMatter === 0 && batteryLevel < 1000)) {
                    if (!btnBatteryx100.disabled) {
                        console.log("Creating 100 batteries");
                        btnBatteryx100.click();
                    } else if (!btnBatteryx10.disabled) {
                        console.log("Creating 10 batteries");
                        btnBatteryx10.click();
                    } else if (!btnMakeBattery.disabled) {
                        console.log("Creating battery");
                        btnMakeBattery.click();
                    }
                } else if (wire > 1) {
                    if (!btnMakeFactory.disabled) {
                        console.log("Creating factory");
                        btnMakeFactory.click();
                    }
                } else if (acquiredMatter > 1) {
                    if (!btnWireDronex1000.disabled) {
                        console.log("Creating 1000 wire drones");
                        btnWireDronex1000.click();
                    } else if (!btnWireDronex100.disabled) {
                        console.log("Creating 100 wire drones");
                        btnWireDronex100.click();
                    } else if (!btnWireDronex10.disabled) {
                        console.log("Creating 10 wire drones");
                        btnWireDronex10.click();
                    } else if (!btnMakeWireDrone.disabled) {
                        console.log("Creating wire drone");
                        btnMakeWireDrone.click();
                    }
                } else if (availableMatter > 1 && acquiredMatter < 1) {
                    if (!btnHarvesterx1000.disabled) {
                        console.log("Creating 1000 harvester drones");
                        btnHarvesterx1000.click();
                    } else if (!btnHarvesterx100.disabled) {
                        console.log("Creating 100 harvester drones");
                        btnHarvesterx100.click();
                    } else if (!btnHarvesterx10.disabled) {
                        console.log("Creating 10 harvester drones");
                        btnHarvesterx10.click();
                    } else if (!btnMakeHarvester.disabled) {
                        console.log("Creating harvester drone");
                        btnMakeHarvester.click();
                    }
                } else if (wire < 1) {
                    if (!btnFactoryReboot.disabled) {
                        console.log("Disassembling all factories");
                        btnFactoryReboot.click();
                    }
                    if (processors > 300) {
                        if (!btnHarvesterReboot.disabled) {
                            console.log("Disassembling all harvester drones");
                            btnHarvesterReboot.click();
                        }
                        if (!btnWireDroneReboot.disabled) {
                            console.log("Disassembling all wire drones");
                            btnWireDroneReboot.click();
                        }
                    } else if (harvesterLevel < wireDroneLevel) {
                        if (!btnHarvesterx1000.disabled) {
                            console.log("Creating 1000 harvester drones");
                            btnHarvesterx1000.click();
                        } else if (!btnHarvesterx100.disabled) {
                            console.log("Creating 100 harvester drones");
                            btnHarvesterx100.click();
                        } else if (!btnHarvesterx10.disabled) {
                            console.log("Creating 10 harvester drones");
                            btnHarvesterx10.click();
                        } else if (!btnMakeHarvester.disabled) {
                            console.log("Creating harvester drone");
                            btnMakeHarvester.click();
                        }
                    } else {
                        if (!btnWireDronex1000.disabled) {
                            console.log("Creating 1000 wire drones");
                            btnWireDronex1000.click();
                        } else if (!btnWireDronex100.disabled) {
                            console.log("Creating 100 wire drones");
                            btnWireDronex100.click();
                        } else if (!btnWireDronex10.disabled) {
                            console.log("Creating 10 wire drones");
                            btnWireDronex10.click();
                        } else if (!btnMakeWireDrone.disabled) {
                            console.log("Creating wire drone");
                            btnMakeWireDrone.click();
                        }
                    }
                }

                if (availableMatter === 0) {
                    slider.value = "200";
                } else {
                    slider.value = "1";
                }
            }
        } else { /* Phase 3 */
            if (!btnMakeProbe.disabled) {
                btnMakeProbe.click();
            }
        }

        if (operations < 0) {
            /* console.log(`Resetting operations to 0 from ${operations}`); */
            /* operations = 0; */
        }
        if (creativity < 0) {
            console.log(`Resetting creativity to 0 from ${creativity}`);
            creativity = 0;
        }
    }
    function slowLoop() {
        if (spaceFlag) {
            var desiredLevels = {
                speed: 0,
                exploration: 0,
                replication: 0,
                hazards: 0,
                factory: 0,
                harvester: 0,
                wire: 0,
                combat: 0
            };
            var combatEnabled = combatProject.flag;
            var drifterOverload = drifterCount > probeCount && unusedClips;
            for (var i = 0; i < probeTrust; ++i) {
                if (desiredLevels.speed == 0 && availableMatter < unusedClips && !drifterOverload) {
                    ++desiredLevels.speed;
                } else if (desiredLevels.exploration == 0 && availableMatter < unusedClips && !drifterOverload) {
                    ++desiredLevels.exploration;
                } else if (!desiredLevels.factory && wire && !drifterOverload) {
                    ++desiredLevels.factory;
                } else if (!desiredLevels.wire && acquiredMatter && !desiredLevels.factory && !drifterOverload) {
                    ++desiredLevels.wire;
                } else if (!desiredLevels.harvester && availableMatter && !desiredLevels.factory && !desiredLevels.wire && !drifterOverload) {
                    ++desiredLevels.harvester;
                } else if (!availableMatter && foundMatter < totalMatter && desiredLevels.speed < 2 && !drifterOverload) {
                    ++desiredLevels.speed;
                } else if (combatEnabled && desiredLevels.combat - 4 <= desiredLevels.hazards) {
                    ++desiredLevels.combat;
                } else if (desiredLevels.replication - 3 <= desiredLevels.hazards) {
                    ++desiredLevels.replication;
                } else {
                    ++desiredLevels.hazards;
                }
            }
            /* Lower levels */
            if (probeSpeed > desiredLevels.speed) {
                console.log("Lowering probe speed");
                btnLowerProbeSpeed.click();
            }
            if (probeNav > desiredLevels.exploration) {
                console.log("Lowering navigation");
                btnLowerProbeNav.click();
            }
            if (probeRep > desiredLevels.replication) {
                console.log("Lowering replication");
                btnLowerProbeRep.click();
            }
            if (probeHaz > desiredLevels.hazards) {
                console.log("Lowering hazards");
                btnLowerProbeHaz.click();
            }
            if (probeFac > desiredLevels.factory) {
                console.log("Lowering factory");
                btnLowerProbeFac.click();
            }
            if (probeWire > desiredLevels.wire) {
                console.log("Lowering wire");
                btnLowerProbeWire.click();
            }
            if (probeHarv > desiredLevels.harvester) {
                console.log("Lowering harvesters");
                btnLowerProbeHarv.click();
            }
            if (probeCombat > desiredLevels.combat) {
                console.log("Lowering combat");
                btnLowerProbeCombat.click();
            }
            /* Raise levels */
            if (probeSpeed < desiredLevels.speed) {
                console.log("Raising probe speed");
                btnRaiseProbeSpeed.click();
            }
            if (probeNav < desiredLevels.exploration) {
                console.log("Raising navigation");
                btnRaiseProbeNav.click();
            }
            if (probeRep < desiredLevels.replication) {
                console.log("Raising replication");
                btnRaiseProbeRep.click();
            }
            if (probeHaz < desiredLevels.hazards) {
                console.log("Raising hazards");
                btnRaiseProbeHaz.click();
            }
            if (probeFac < desiredLevels.factory) {
                console.log("Raising factory");
                btnRaiseProbeFac.click();
            }
            if (probeWire < desiredLevels.wire) {
                console.log("Raising wire");
                btnRaiseProbeWire.click();
            }
            if (probeHarv < desiredLevels.harvester) {
                console.log("Raising harvesters");
                btnRaiseProbeHarv.click();
            }
            if (probeCombat < desiredLevels.combat) {
                console.log("Raising combat");
                btnRaiseProbeCombat.click();
            }
        }

        if (spaceFlag) {
            if (availableMatter === 0) {
                slider.value = "199";
            } else {
                slider.value = "1"
            }

            if (!btnIncreaseProbeTrust.disabled) {
                console.log("Increasing probe trust");
                btnIncreaseProbeTrust.click();
            }
            if (!btnIncreaseMaxTrust.disabled) {
                console.log("Increasing max probe trust");
                btnIncreaseMaxTrust.click();
            }
        }
    }
    function slowestLoop() {
        if (spaceFlag) {
            /* Can run multiple times... */
            if (!btnEntertainSwarm.disabled && !doNotEntertain && btnEntertainSwarm.offsetWidth > 0 && btnEntertainSwarm.offsetHeight > 0) {
                console.log("Entertaining the swarm");
                btnEntertainSwarm.click();
            }
            if (!btnSynchSwarm.disabled && btnSynchSwarm.offsetWidth > 0 && btnSynchSwarm.offsetHeight > 0) {
                console.log("Synchronizing the swarm");
                btnSynchSwarm.click();
            }
        }
    }
    window.loopId = setInterval(loop);
    window.slowLoopId = setInterval(slowLoop, 250);
    window.slowestLoopId = setInterval(slowestLoop, 2500);
}
run();
