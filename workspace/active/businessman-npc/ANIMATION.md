# Seated idle

Expressiveness revision: body now sways ±1.2 degrees sideways and ±0.8 degrees fore/aft over6 seconds. Crossed right calf oscillates ±3 degrees yaw and lifts0–2.2 degrees, repeating every2 seconds. Right forearm counter-motion helps maintain thigh contact. Existing breath/head tracks retained. New tracks use0.25-second authored samples; loop endpoints identical. Checked rendered poses at0.5/1.5/4.5/6: left foot staysY0, footprint below16x16. User review pending.

Latest revision: crossed right leg over left, adjusted right hand, left foot remains grounded. Use businessman_npc_crossed.geo.json (old uncrossed geometry retained separately). Existing idle keys preserved and retested at0/1.5/4.5/6 seconds. No uncross-to-cross transition; this is a crossed seated idle.

Animation: animation.businessman_npc.seated_idle. Duration6 seconds, loop enabled, no external Molang parameters. Play from0 in Blockbench Animate mode. Use with this project's seated rest geometry; no standing transition or behavior pack supplied.

Two subtle breaths per loop (torso depth up to2.5%), head yaw ±1.5 degrees and pitch ±0.6 degrees; left forearm follows at smaller amplitude. Inverse depth scale on head/upper arms limits inherited stretching. Pelvis, thighs, calves and suitcase have no authored motion. Keys every0.75 seconds, Catmull-Rom interpolation.

Live rendered-pose checks at0,1.5,3,4.5,6 seconds: minY=0 throughout; footprint below16x16; start/end bounds identical. Rest and head-motion extremum visually reviewed for cheek-hand proximity. No Minecraft runtime test. Geometry exported natively; standalone animation JSON packaged with Bedrock rotation X/Y sign conversion.

Animation ready for user review; final approval pending.

Final status: all revisions approved by user; final project saved. This supersedes earlier pending-review notes.
