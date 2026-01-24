# Prompt 1
I've been looking into options to have a kind of home server running Immich to serve about 500Gb of personal photos. This is way too much to store on my phone but I would love to get to a solution where it almost feels like I have all those photos within easy access on my phone and maybe even for something like a digital picture frame.
I've been looking at things like affordable NAS setups but I'm actually thinking these might be too complicated for me and I wonder if I might be able to get away with buying a second hand laptop and running that as a server.
I don't really have a home network. To connect to the internet from my laptop I use my personal hotspot on my iphone.
It would be wonderful to find a solution which worked in with this kind of framework (ie there being no home router). I was thinking maybe a good idea would be even buying a second second hand m1 macbook air - my laptop that I use for work - so that if there was ever a problem with my work computer I could actually use that in a pinch (like having a spare old phone lying around just in case). 
One problem I can see with the m1 mac solution is that they don't really come with much built in storage... I wonder maybe then would it be a lot cheaper to make some kind of raspberry pi setup. There won't be really much data load on the system... accessing the photos here and there and maybe if the setup works well streaming the odd film.
Could you make some suggestions with budgets... I can get a m1 macbook for around 500 euros right now.
I kind of like this kind of solution as I will keep a backup of my photos on an external drive and so having the photo server set up will be like a backup that I don't have in place at the moment (I only have the external hard drive).
For this kind of line of questioning could you also make some suggestions as to how I might efficiently and maybe better prompt LLMs to help me with this kind of problem. Are there any kind of 'agent workflows' I should be setting me up to help me?

# Response 1
This is a great project! Let me break down your options and then suggest how to approach this systematically with LLMs.

## Your Options

**The M1 MacBook Air approach ($500-600)** This could actually work well for your use case. The challenges:

- Storage: Base models have 256GB, which won't hold your 500GB of photos
- Solution: Use an external USB SSD (1TB for ~€80-100). Modern SSDs are reliable enough for 24/7 use
- You'd run Immich in Docker, keep it plugged in and connected to your iPhone's hotspot
- Bonus: Yes, it's a backup computer if your work machine fails

The appeal here is simplicity - macOS is familiar, and if something breaks, you know how to troubleshoot it.

**Raspberry Pi 5 (8GB) approach (~€200-250 total)**

- Pi 5 8GB: ~€80-90
- Case with active cooling: ~€15-20
- 1TB external SSD: ~€80-100
- Power supply: ~€12
- microSD card: ~€10

More efficient power-wise, but you're learning a new system (Linux/Raspberry Pi OS). The Pi 5 is genuinely capable enough for Immich with your usage pattern.

**The "no home router" constraint** This is your biggest challenge. Here's the issue: when your server connects to your iPhone hotspot, and then your phone tries to connect to the server, you're creating a loop. Your phone _is_ the network, so it can't be a client on that same network in the traditional sense.

**Possible solutions:**

1. **Tailscale** (my recommendation): Creates a mesh VPN. Your server joins the Tailscale network via your hotspot, your phone joins via cellular data, and they can talk to each other. Works beautifully for this exact scenario.
    
2. **Get a cheap router** (~€30-50): Connect both your phone and server to it via WiFi. Use your phone's hotspot when you need internet for the server. This gives you a local network.
    
3. **Direct WiFi connection**: Some setups let your phone create an ad-hoc network, but this is finicky and not well-supported on iOS.
    

**My recommendation for your situation:**

- **Budget option**: Raspberry Pi 5 (8GB) + external SSD + Tailscale (~€200-250)
- **Comfort option**: M1 MacBook Air + external SSD + Tailscale (~€600-700)

The M1 Mac wins on "I can actually use this for something else" and "I know how to fix it." The Pi wins on power consumption (5-10W vs 15-30W) and cost.

## How to Prompt LLMs for This Kind of Project

You're actually doing pretty well already, but here are some strategies:

**1. Break it into phases with targeted prompts:**

- Phase 1: "Help me understand the networking requirements for running a home server when my only internet is an iPhone hotspot"
- Phase 2: "Compare hardware options for a low-power Immich server: M1 MacBook Air vs Raspberry Pi 5, considering 500GB storage needs"
- Phase 3: "Walk me through setting up Immich with Docker on [chosen platform]"
- Phase 4: "How do I configure Tailscale to access my server from my phone?"

**2. Ask for decision frameworks, not just answers:** "What are the key decision points I should consider when choosing between X and Y for this use case? Create a comparison table."

**3. Request step-by-step validation:** "Before I buy anything, can you verify my understanding: I'm planning to [describe setup]. What problems am I likely to encounter?"

**4. Use iterative refinement:** Start broad, then narrow: "I want to run a photo server" → "Using Immich" → "Without a traditional home network" → "Here's my specific constraint..."

**5. Ask for learning resources:** "What should I learn about Docker/networking/Linux to troubleshoot this independently? Point me to specific documentation."

**Regarding "agent workflows":**

For a project like this, you don't need complex agents yet. What would help:

1. **Create a project document** (you could use Claude or ChatGPT for this):
    
    - "Help me create a markdown document that tracks: hardware decisions, setup steps completed, configuration choices, and problems encountered"
2. **Use Claude for planning, then execution:**
    
    - First conversation: "Help me plan this project and identify all dependencies"
    - Separate conversations for each implementation phase (keeps context clean)
3. **When you hit problems, provide context:**
    
    - "I'm setting up Immich on a Raspberry Pi 5. I've completed steps X, Y, Z. Now I'm getting this error: [paste error]. Here's my docker-compose.yml: [paste]. What's wrong?"

**Concrete next steps:**

1. Decide on your comfort level: Do you want to learn Linux/Pi, or stick with macOS familiarity?
2. Research Tailscale - this solves your networking problem elegantly
3. Ask an LLM: "Create a complete shopping list for a Raspberry Pi 5 Immich server with 1TB storage for my location (Europe)"
4. Then: "Create a step-by-step setup guide for Immich on [your chosen platform] using Tailscale for remote access"

Would you like me to dive deeper into any of these aspects, like the Tailscale setup or creating a decision matrix between the Pi and MacBook options?