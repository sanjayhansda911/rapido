# Rapido Metro • Hyderabad Metro Group Booking Flow

> **Independent product concept prototype inspired by Rapido's mobile design language.**  
> *Disclaimer: Independent concept, not affiliated with Rapido or Hyderabad Metro Rail (HMRL).*

A mobile-first web prototype (390px wide, centered on desktop) solving a key transit limitation: enabling passengers boarding at the **same origin station** to travel to **different destination stations** and book/manage their journey as **ONE unified group trip**, while issuing discrete turnstile-ready QR tickets behind the scenes.

---

## 🎯 The Problem & The Solution

### The Current Limitation
In current ride-hailing and transit apps:
1. **Single Destination Lock**: When purchasing multiple metro tickets, all passengers must travel to the exact same station. Groups starting together but getting down at different stations are forced to make separate bookings sequentially.
2. **Missing & Fragmented Tickets**: Sequential purchases cause tickets to get scattered or vanish from "Upcoming Rides".
3. **Turnstile Friction**: Sharing tickets requires passing physical phones around or forcing friends to log into their own accounts at busy AFC gates.

### The Proposed Group Booking Experience
- **One Grouped Trip**: Board together at **Uppal** and select individual destinations for each friend (*Raidurg*, *Stadium*, *NGRI*, etc.).
- **Same Destination Stepper**: Option to easily increase passenger count for the same destination using a `[-] count [+]` stepper.
- **Solo or Group**: Proceed to pay immediately for a single ticket or add co-passengers anytime.
- **Instant QR Access**: The primary user can view the QR code of **any passenger** in the group directly in the app.
- **Frictionless WhatsApp Sharing**: Co-passengers receive a link to a **view-only E-Ticket page with NO app login required**.
- **Independent Cancellation**: Cancel individual tickets with a clear refund breakdown without voiding the rest of the group.

---

## 📱 End-to-End Screen Journey

1. **Rapido Home Screen**: Authentic Rapido home landing page with pickup location bubble, service tabs (`Ride` & `Metro`), search bar, recent destinations with favorites, and the **"Metro tickets"** hero card with `% Offers` badge.
2. **Station Selection Screen**: Blue Hyderabad Metro header with train graphics and `METRO20` coupon. Select Boarding Station (From) and Destination (To) with live line indicators.
3. **Group Metro Booking Screen**:
   - Primary passenger route with live fare calculation.
   - Stepper to increase passengers to the same stop.
   - Button to add co-passengers with custom names and independent destination pickers.
   - Total fare calculation and prominent Rapido Yellow (`#FFC907`) pill button.
4. **Processing Screen**: Concurrent 3-step progress stepper per passenger (`Payment initiated` → `Request sent to Hyderabad Metro` → `Confirmed`).
5. **Trip Confirmed Screen**: Confetti celebration, unified group pass card, and individual ticket actions (**"View QR"**, **"Share on WhatsApp"**, **"Cancel"**).
6. **View-Only E-Ticket & WhatsApp Share**:
   - Turnstile-ready large SVG QR code with dynamic laser scanner animation.
   - Validity timer (*Valid till 11:59 pm today*).
   - WhatsApp share sheet with real chat preview and 1-click test link.
7. **My Tickets Screen**: Upcoming grouped trip card (tickets never disappear) and past ride records matching official Rapido styling.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 8
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **QR Engine**: `qrcode.react` (SVG high-resolution rendering)
- **Visual FX**: `canvas-confetti`

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/sanjayhansda911/rapido.git

# Navigate into project directory
cd rapido

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

---

## 📄 License
MIT License. Created for concept demonstration and product design prototyping purposes.
