import type { DefinitionSection } from "@/lib/definition";

export const lead = [
  "Architecture, engineering, and construction teams already produce more information than a meeting can hold. Models run to millions of elements. Solvers return daylight, airflow, structure, and comfort. Sensors stream the state of a live facility. AI now proposes the next move as well as the next chart. In September 2026, AEC Tech Hub and Epic Games published **From Data to Decisions**, a white paper by Allister Lewis, on what happens when Unreal Engine becomes the room where that material is explored together. This is an account of that shift: operate a system, rehearse a situation, and read performance on the design itself.",
];

export const sections: DefinitionSection[] = [
  {
    id: "usability",
    title: "The usability gap",
    blocks: [
      {
        type: "toc",
        items: [
          { href: "#usability", label: "The usability gap" },
          { href: "#decision-environment", label: "A decision environment" },
          { href: "#operational", label: "Operate a system you cannot see" },
          { href: "#scenario", label: "Rehearse the situation" },
          { href: "#design", label: "Read the analysis on the building" },
          { href: "#three-roles", label: "Three roles, one shift" },
          { href: "#where-to-start", label: "Where a team should start" },
          { href: "#sources", label: "Sources" },
        ],
      },
      {
        type: "paragraph",
        text: "The records already exist. A daylight study sits in a specialist solver. Operations sit on dashboards. Geometry sits in a building information model. The story of all three sits in a slide. Each tool is doing its job. A project team still has to assemble a picture that none of them shows alone.",
      },
      {
        type: "table",
        table: {
          headers: ["What the team has", "Where it lives", "What a review still needs"],
          rows: [
            [
              "A model with millions of elements",
              "The BIM authoring tool",
              "A way for someone outside that tool to stand in the issue",
            ],
            [
              "Daylight, airflow, structure, comfort",
              "Specialist simulation",
              "The result painted on the building, next to the design",
            ],
            [
              "Live sensor streams",
              "2D screens, diagrams, charts",
              "Which component is changing, in the room",
            ],
            [
              "An AI recommendation",
              "A report or a chat",
              "A check against the real geometry before anyone acts",
            ],
          ],
        },
      },
      {
        type: "paragraph",
        text: "Geometry is the part that travels. Meshes move between tools with relative ease. Object identity, parameters, classifications, and requirements fall away at the handoff. A model can arrive intact and still be the wrong object for the decision in front of the team. The white paper’s line for this is direct: teams can get the data, and they still cannot use it as one picture.",
      },
      {
        type: "subheading",
        text: "Where the workflow breaks",
      },
      {
        type: "bullets",
        items: [
          "**Issues leave the model.** BIM Collaboration Format can pass an issue between authoring tools. The issue rarely arrives in a place where the people who must decide can walk it.",
          "**The site is bigger than the authoring view.** Infrastructure and city projects mix BIM, terrain, point clouds, and photogrammetry. Review at that scale depends on streaming, including Open Geospatial Consortium 3D Tiles.",
          "**The as-built lags the site.** Capture is getting faster. Folding a new scan into the environment people decide in is still slow, manual work.",
          "**The audience is outside the authoring seat.** Most stakeholders will never open the modeler. A browser session with nothing to install is the access many of those reviews still lack.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "What the RICS 2025 survey measured",
        text: "The [RICS Artificial Intelligence in Construction Report 2025](https://www.rics.org/news-insights/artificial-intelligence-in-construction-report), which the white paper cites, asked construction professionals what blocks AI adoption. Lack of skilled people leads at 46%. Integration with existing systems is 37%. Data quality and availability is 30%. A faster generator of recommendations still has to land in the systems, and the data, a project already has.",
      },
    ],
  },
  {
    id: "decision-environment",
    title: "A decision environment",
    blocks: [
      {
        type: "paragraph",
        text: "Unreal Engine entered many architecture and engineering offices as a way to make a still or a walkthrough. Clients could move through a picture of the project. The engine under that picture was built for something larger: persistent worlds that stay live while many people interact with them. That is the scale an operations view, a training ground, and a masterplan review actually need.",
      },
      {
        type: "paragraph",
        text: "Authoring platforms, including Autodesk and Bentley, now expose design, asset, and operational data through APIs. Industry Foundation Classes and BCF carry exchange between tools. 3D Tiles stream a city-scale scene. The feeds are more reachable than they were. They are still separate experiences until something holds them in one spatial session.",
      },
      {
        type: "paragraph",
        text: "In that session a team can toggle performance, compare options, replay an operational history, or run a hazard through weather and time of day. The white paper treats this as a change of job. The engine is there for the moment a team interrogates the project, which is a larger job than producing the rendering.",
      },
      {
        type: "subheading",
        text: "Epic’s tools, as the paper lines them up",
      },
      {
        type: "table",
        table: {
          headers: ["Tool", "Role beside the system of record"],
          rows: [
            [
              "Datasmith",
              "Ingest authoring data into Unreal and keep the scene in step with the source",
            ],
            [
              "Twinmotion",
              "Make federated model review and visualisation faster to stand up",
            ],
            [
              "Unreal Engine",
              "Run the interactive environment people actually enter",
            ],
            [
              "RealityScan",
              "Bring a fresh capture back toward the as-built site",
            ],
          ],
        },
      },
      {
        type: "callout",
        tone: "ue",
        title: "Same runtime, different product",
        text: "This site already uses Unreal as a world, in [How to Build a Game in UE 5.8 with a Modern Rust Blockchain for Digital Economy](/blog/how-to-build-a-game-in-ue-5-8-with-modern-rust-blockchain-for-digital-economy). A harbor economy and a reactor test loop are different products. Both need a runtime that can hold a large spatial scene, update it while people are inside it, and leave the source of truth in the tools that own it.",
      },
    ],
  },
  {
    id: "operational",
    title: "Operate a system you cannot see",
    blocks: [
      {
        type: "paragraph",
        text: "Implexus Labs built a live twin with Argonne National Laboratory for the Mechanisms Engineering Test Loop, a liquid-metal facility used to test high-temperature reactor components. The conditions that matter are inside a system operators cannot read by looking at it. The facility carries extensive mechanical plant and more than a thousand sensors for temperature and other conditions.",
      },
      {
        type: "paragraph",
        text: "Before the twin, that stream arrived as 2D human-machine interfaces, diagrams, charts, and dashboards. The numbers were real. The spatial question — which part of the loop is changing, relative to which other part — stayed a mental assembly job.",
      },
      {
        type: "paragraph",
        text: "Implexus uses a strict meaning for the twin. It is a virtual stand-in that keeps geometry and operational data in step, on a defined rhythm, so people can inspect a past state, watch the present, and look ahead. A mesh with a spreadsheet pinned to it does not meet that bar. The aim at Argonne was an environment where engineers read the plant spatially, with a longer path toward remote monitoring, training, and assistance for control.",
      },
      {
        type: "subheading",
        text: "What had to be built before the picture worked",
      },
      {
        type: "paragraph",
        text: "The shell came from Autodesk Revit. Loop components came from Autodesk Inventor. Reality capture documented the as-built facility. Inside Unreal, the model still had to be prepared. Reactor parts were cleaned in Blender. More than 5,000 elements became about 220 zones, each one tied to where a sensor actually sits. Every zone was defined by hand. Drawings and sensor schedules were checked against the model so a reading could not land on the wrong object.",
      },
      {
        type: "bullets",
        items: [
          "**A stable id per zone.** About 220 zones, each one a place a data point is allowed to resolve to.",
          "**Metadata on the object.** Sensor type, units, ranges, and alarm thresholds travel with the zone. A bare number on a mesh is an unfinished link.",
          "**A mapping someone checked.** Engineering drawings and the sensor schedule cross the 3D model. An unlinked or swapped sensor is a wrong picture of the plant.",
          "**An update path.** Live streams, historical playback, and dropouts have to land without rebuilding the scene.",
        ],
      },
      {
        type: "paragraph",
        text: "Operational data arrived over REST. The Data Sculpt plugin mapped those streams onto objects and behavior in the Unreal scene. Engineers could then see absolute and relative temperature across the loop, open one sensor in place, filter a range to isolate an anomaly, replay history on a timeline, and query the scene from inside the interface.",
      },
      {
        type: "paragraph",
        text: "The result ships as a desktop application and as VR. It runs entirely on Argonne’s own network: an executable, facility data kept off a public cloud, and no internet connection required to operate it. Desktop, mobile, and VR, plus the authorisation, stay inside that network. Campus credentials or a VPN are the door. For a government laboratory, that deployment model is part of the product.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "The API moves the numbers",
        text: "REST gets a reading from the plant into the process. The zone, the id, the units, and the drawing check are what make that reading a place in the facility. The white paper treats that preparation as the bulk of the work, and as an ongoing pipeline.",
      },
    ],
  },
  {
    id: "scenario",
    title: "Rehearse the situation",
    blocks: [
      {
        type: "paragraph",
        text: "Some decisions have to be practised in space. A written procedure can list the steps for a roadway incident. It cannot carry visibility, traffic, weather, a hazard, and the way people and vehicles move through the same minute. Jacobs’ RealScene is an extended-reality training platform for that kind of preparation. The public case is first-responder training: personnel who have to read a scene quickly and choose under pressure.",
      },
      {
        type: "paragraph",
        text: "Jacobs built RealScene with the Pennsylvania Turnpike Commission and the Eastern Transportation Coalition so emergency crews can practise incident response in a virtual environment. In November 2023 the Intelligent Transportation Society of Pennsylvania named it Project of the Year, for work that improves the safety and reliability of the state’s roadway network.",
      },
      {
        type: "table",
        table: {
          headers: ["A manual can carry", "The scenario has to carry"],
          rows: [
            [
              "The written procedure",
              "The space the procedure happens in",
            ],
            [
              "A diagram of the scene",
              "Visibility, weather, and time of day as they change",
            ],
            [
              "A classroom briefing",
              "Traffic, hazards, and the movement of people and vehicles",
            ],
            [
              "One telling of the event",
              "The same exercise saved, reloaded, and run again",
            ],
          ],
        },
      },
      {
        type: "paragraph",
        text: "Unreal supplies the real-time scene: interactive physics, rendering, and a layout a trainer can change. Inside RealScene, instructors build situations from prebuilt assets. Trainees move freely through the environment, meet the hazard, and watch the consequences of a choice.",
      },
      {
        type: "bullets",
        items: [
          "**Six degrees of freedom.** People move through the scene on their own path.",
          "**Drag-and-drop scenes.** A trainer can assemble a situation without building the runtime.",
          "**Libraries sized for the job.** The paper describes more than 100 assets — vehicles, objects, characters — across six base environments.",
          "**Hazards in the world.** Custom messages, plus particle smoke and fire, sit in the scene the trainee is already in.",
          "**Conditions that change the decision.** Animated traffic, weather, and time of day are controls, because they change what a safe response is.",
          "**Save and load.** The same scenario can be stored and run again, which is what turns one exercise into a training programme.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Practice before the roadway",
        text: "The white paper’s claim for this role is experiential. Documentation describes the situation. The environment is where a crew practises it, including events that are rare or dangerous to stage on a live road.",
      },
    ],
  },
  {
    id: "design",
    title: "Read the analysis on the building",
    blocks: [
      {
        type: "paragraph",
        text: "Daylight, computational fluid dynamics, thermal comfort, and structure already tell a design team how a building or a district will behave. Those results usually leave the solver as a color map, a chart, or a still diagram. They are accurate, and they are hard for an architect, an engineer from another discipline, or a client to read back onto the place.",
      },
      {
        type: "paragraph",
        text: "On a masterplan the audience is larger still. Governments, developers, and city authorities are deciding how a population will live, work, and move. Hundreds of people, in different cities and disciplines, share one set of decisions. Drawings and reports remain the deliverable. They rarely show the district as one connected system.",
      },
      {
        type: "paragraph",
        text: "Buro Happold’s Digital Masterplanning work puts that district into Unreal. Stakeholders move through a virtual version of the place — transport, development corridors, utilities, environmental constraints — and try future scenarios together. Designers, engineers, planners, operators, and clients look at the same evidence. The gain is the combination: several analyses, a session shaped for the people in the room, and a high-fidelity context a non-specialist can enter. Performance becomes part of walking the project.",
      },
      {
        type: "subheading",
        text: "What they bring into one scene",
      },
      {
        type: "bullets",
        items: [
          "**Place and the model.** GIS, geospatial sets, and building information models.",
          "**The works.** Infrastructure, utilities, construction schedules, and asset information.",
          "**How it will perform.** Environmental and sustainability data, mobility networks, and operations and maintenance.",
          "**The live layer, when it exists.** Sensor and IoT streams, attached where a project already has them.",
        ],
      },
      {
        type: "paragraph",
        text: "Several techniques carry solver output into the engine. Daylight or thermal comfort can be baked into the mesh as vertex color, so switching a design option repaints the geometry at once. Procedural meshes and splines turn CFD streamlines into paths that move through the scene. Niagara drives particle views from the same data. In workflows Epic has presented, Rhino Compute and Grasshopper stay linked, so a parameter change updates Unreal geometry in the session.",
      },
      {
        type: "paragraph",
        text: "One concrete case is a district energy network, from substations out to households. The scene holds pipe capacity, velocity, pressure gradient, length, and diameter beside household energy profiles. The team can ask how demand and supply meet, how the network behaves at peak, and where the next investment has to land if the system is going to hold. The same pattern covers the daily life of a masterplan: a road closure, density and constraints, crowd flow, and land-use phasing that shows how the place arrives over time.",
      },
      {
        type: "paragraph",
        text: "Access is part of the design. Buro Happold runs these environments on a mix of on-premise and cloud infrastructure, and uses pixel streaming so several people can share a high-fidelity view without a specialist workstation. Technical and non-technical participants can test a what-if in the same session. Each profession still has its own language. The shared scene is the language they use when the decision is spatial.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "The solver stays the solver",
        text: "Unreal is the layer where a planner and a specialist look at a result together. Daylight, CFD, structure, and energy calculations remain in the tools that produced them. The engine’s job is to make those results interrogable in the design, in front of the people who have to choose.",
      },
    ],
  },
  {
    id: "three-roles",
    title: "Three roles, one shift",
    blocks: [
      {
        type: "paragraph",
        text: "The three projects use the engine differently. They share a pattern. BIM platforms, simulation tools, geospatial systems, and operational stores remain the systems of record. Unreal is where those records are brought into one experience. The question moves from how to generate or store the information to how a team explores it and acts.",
      },
      {
        type: "table",
        table: {
          headers: ["Role", "What people do there", "What changes at work", "Example"],
          rows: [
            [
              "Operational",
              "Watch a live system on the model",
              "Faster diagnosis, and a single spatial picture of the asset",
              "Implexus and Argonne METL",
            ],
            [
              "Scenario",
              "Practise an event before it is real",
              "Repeatable training and lower risk on the day",
              "Jacobs RealScene",
            ],
            [
              "Design",
              "Read performance inside the design",
              "Faster alignment, and technical results a client can question",
              "Buro Happold Digital Masterplanning",
            ],
          ],
        },
      },
      {
        type: "paragraph",
        text: "The business case in the paper follows from that shared picture. Teams carry fewer errors into delivery. Conflicts surface before they become rework. Approvals move with evidence people can question in the room. Once the asset is in use, operators keep a clearer view of it. The paper also notes the same pattern beyond AEC, in manufacturing, energy, mobility, and public safety: large volumes of data, and a need for one understanding of them.",
      },
      {
        type: "callout",
        tone: "info",
        title: "From reporting to exploring",
        text: "A chart reports a condition. A decision environment lets the team move through the condition, filter it, and try the next state. The white paper’s phrase for the payoff is clarity. Realism is a means. The decision is the product.",
      },
    ],
  },
  {
    id: "where-to-start",
    title: "Where a team should start",
    blocks: [
      {
        type: "paragraph",
        text: "The practical advice is selective. A real-time engine belongs where understanding currently breaks, and there the break has a shape: sensor volume a dashboard cannot place, training that needs the room and the hazard, or a correct simulation the rest of the project cannot read.",
      },
      {
        type: "bullets",
        items: [
          "**See complex information in space.** The component, the pipe, the street, and the result occupy one view.",
          "**Explore performance, interactively.** Options, ranges, and time can be changed while the team is still in the scene.",
          "**Rehearse the operational case.** Rare and dangerous situations get a safe run-through.",
          "**Carry the insight to a wider room.** Specialists, clients, and operators look at one environment.",
        ],
      },
      {
        type: "subheading",
        text: "Questions that outlast the first demo",
      },
      {
        type: "steps",
        items: [
          {
            title: "**Name who owns the environment after launch.**",
            bullets: [
              "A twin, a training scene, or a masterplan review needs a team that keeps it, the way the source models already have owners.",
            ],
          },
          {
            title: "**Decide how the scene stays current.**",
            bullets: [
              "Geometry, metadata, and operational data drift as soon as the source systems move. The Argonne zones only stayed meaningful because the mapping was maintained.",
            ],
          },
          {
            title: "**Pick the door people will actually use.**",
            bullets: [
              "Desktop executable, pixel streaming, a packaged build, or a headset. Argonne stayed on-premise. Buro Happold streams a shared view. The access model is a design choice.",
            ],
          },
          {
            title: "**Name the decision that pays for keeping it.**",
            bullets: [
              "Diagnosis, a repeatable exercise, or a masterplan choice the room can defend. Ongoing cost follows that outcome.",
            ],
          },
        ],
      },
      {
        type: "paragraph",
        text: "AI widens the same gap. It adds volume, speed, and recommendations of its own. The advantage shifts toward checking a proposal against geometry, context, and constraints before anyone commits. A real-time environment is one place that check can happen with the people who have to live with the result.",
      },
      {
        type: "paragraph",
        text: "The question the paper leaves is practical. Produce a clearer view of the project, and build the environment in which a better decision can actually be made. Systems of record stay where they are. The new layer is where their contents become something a team can explore and act on.",
      },
      {
        type: "subheading",
        text: "Read next on this blog",
      },
      {
        type: "bullets",
        items: [
          "[How to Build a Game in UE 5.8 with a Modern Rust Blockchain for Digital Economy](/blog/how-to-build-a-game-in-ue-5-8-with-modern-rust-blockchain-for-digital-economy) — Unreal runs the world; the chain records who owns the sword, the land, and the listing.",
          "[The Web3 Gaming Landscape Reset: From Play-to-Earn to Play-and-Own](/blog/the-web3-gaming-landscape-reset) — gameplay first, with ownership as a record players can keep.",
          "[Modern Rust Blockchain for Games and Digital Economies](/blog/modern-rust-blockchain-for-games-and-digital-economies) — keep play off the hot path and settle ownership on the ledger.",
        ],
      },
    ],
  },
  {
    id: "sources",
    title: "Sources",
    blocks: [
      {
        type: "paragraph",
        text: "This post follows **From Data to Decisions** (AEC Tech Hub × Epic Games, September 2026), written by Allister Lewis. Project figures — the Argonne sensor count, the reduction from more than 5,000 elements to about 220 zones, the on-premise deployment, the RealScene feature set, and the Buro Happold techniques — are the ones that paper reports. The links below are the public sources named in its reference list, plus the RICS page behind the adoption figures.",
      },
      {
        type: "bullets",
        items: [
          "[AECtech 2025, Epic Games](https://www.youtube.com/watch?v=j3ebEkHpcPU&t=261s) — the talk the paper points to for Unreal in AEC.",
          "[Implexus Labs, live digital twin](https://www.youtube.com/watch?v=LL-CAfxmvGE) — the operational twin walkthrough cited for Argonne.",
          "[Jacobs RealScene](https://www.jacobs.com/solutions/realscene) — the training platform, built with the Pennsylvania Turnpike Commission and the Eastern Transportation Coalition.",
          "[ITSPA Project of the Year](https://www.jacobs.com/newsroom/news/realscene-immersive-first-responder-training-tool-named-itspa-project-year) — Jacobs’ account of the November 2023 award. The paper also points at [itspennsylvania.com/Awards](https://itspennsylvania.com/Awards).",
          "[Buro Happold on game engines for the built environment](https://www.burohappold.com/insights/the-transformative-power-of-game-engine-technology-for-the-built-environment/) and [New Civil Engineer, April 2024](https://www.newcivilengineer.com/opinion/game-on-the-power-of-unreal-engine-in-architecture-engineering-and-construction-18-04-2024/).",
          "[RICS, Artificial Intelligence in Construction Report 2025](https://www.rics.org/news-insights/artificial-intelligence-in-construction-report) — skills 46%, integration 37%, data quality and availability 30%.",
          "AEC Tech Hub describes itself as a media company for AEC startups, architects, engineers, and construction professionals. The paper lists [aectechhub.com](https://www.aectechhub.com/) and [aectechjobs.com](https://www.aectechjobs.com/).",
        ],
      },
    ],
  },
];
