import { useState } from 'react';
import type { 
  GroupTrip, 
  ScreenType, 
  Ticket, 
  TravellerDraft 
} from './types/metro';
import { 
  INITIAL_PAST_TICKETS, 
  INITIAL_UPCOMING_GROUP_TRIP,
  calculateFare
} from './data/mockStations';
import { PhoneFrame } from './components/PhoneFrame';
import { HomeScreen } from './screens/HomeScreen';
import { StationSelectScreen } from './screens/StationSelectScreen';
import { BookTripScreen } from './screens/BookTripScreen';
import { ProcessingScreen } from './screens/ProcessingScreen';
import { TripConfirmedScreen } from './screens/TripConfirmedScreen';
import { FriendQRScreen } from './screens/FriendQRScreen';
import { MyTicketsScreen } from './screens/MyTicketsScreen';

export function App() {
  // Navigation State - starts at Rapido Landing / Home Screen
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');

  // Journey Stations (Default: Uppal -> Raidurg)
  const [originStation, setOriginStation] = useState<string>('Uppal');
  const [primaryDestination, setPrimaryDestination] = useState<string>('Raidurg');

  // Group Travellers (Default: Solo user "You" - NO prefilled extra passengers!)
  const [travellers, setTravellers] = useState<TravellerDraft[]>([
    {
      id: 'traveller-1',
      name: 'You',
      isPrimary: true,
      destination: 'Raidurg',
      fare: calculateFare('Uppal', 'Raidurg'),
    },
  ]);

  // Trips & Tickets State
  const [upcomingTrips, setUpcomingTrips] = useState<GroupTrip[]>([
    INITIAL_UPCOMING_GROUP_TRIP,
  ]);
  const [pastTickets] = useState<Ticket[]>(INITIAL_PAST_TICKETS);
  const [confirmedTrip, setConfirmedTrip] = useState<GroupTrip | null>(
    INITIAL_UPCOMING_GROUP_TRIP
  );
  const [selectedTicketForQR, setSelectedTicketForQR] = useState<Ticket | null>(
    INITIAL_UPCOMING_GROUP_TRIP.tickets[0]
  );

  // When primary destination is updated on station select screen, sync it
  const handleUpdatePrimaryDestination = (newDest: string) => {
    setPrimaryDestination(newDest);
    setTravellers([
      {
        id: 'traveller-1',
        name: 'You',
        isPrimary: true,
        destination: newDest,
        fare: calculateFare(originStation, newDest),
      },
    ]);
  };

  // Flow Step 1: User taps "Metro tickets" on Rapido Home
  const handleOpenMetro = () => {
    setCurrentScreen('station_select');
  };

  // Flow Step 2: User completes station selection and taps "Continue to Add Passengers"
  const handleContinueToBooking = () => {
    setCurrentScreen('book');
  };

  // Flow Step 3: User taps "Proceed to pay"
  const handleProceedToPay = () => {
    setCurrentScreen('processing');
  };

  // Flow Step 4: Processing finishes -> Trip Confirmed
  const handleProcessingComplete = (newTrip: GroupTrip) => {
    setConfirmedTrip(newTrip);
    setUpcomingTrips([newTrip, ...upcomingTrips]);
    setCurrentScreen('confirmed');
  };

  // View QR for a specific passenger
  const handleViewQR = (ticket: Ticket) => {
    setSelectedTicketForQR(ticket);
    setCurrentScreen('friend_qr');
  };

  // Cancel an individual ticket
  const handleCancelTicket = (ticketId: string) => {
    const cancelInTrip = (trip: GroupTrip): GroupTrip => ({
      ...trip,
      tickets: trip.tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'cancelled',
              refundAmount: t.fare,
              cancelledAt: 'Today',
            }
          : t
      ),
    });

    if (confirmedTrip) {
      setConfirmedTrip(cancelInTrip(confirmedTrip));
    }
    setUpcomingTrips((prev) => prev.map((trip) => cancelInTrip(trip)));

    if (selectedTicketForQR && selectedTicketForQR.id === ticketId) {
      setSelectedTicketForQR({
        ...selectedTicketForQR,
        status: 'cancelled',
        refundAmount: selectedTicketForQR.fare,
      });
    }
  };

  // All tickets belonging to current active trip (for the QR switcher)
  const currentTripTickets = confirmedTrip ? confirmedTrip.tickets : (upcomingTrips[0]?.tickets || []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-0 sm:py-6 sm:px-4 antialiased">
      {/* 390px Mobile Phone Frame - Clean with no external toolbars */}
      <PhoneFrame>
        {/* Screen 1: Rapido Home Landing Screen */}
        {currentScreen === 'home' && (
          <HomeScreen
            onOpenMetro={handleOpenMetro}
            onOpenMyTickets={() => setCurrentScreen('my_tickets')}
          />
        )}

        {/* Screen 2: Station Selection Screen (Screenshot 3) */}
        {currentScreen === 'station_select' && (
          <StationSelectScreen
            originStation={originStation}
            setOriginStation={setOriginStation}
            destinationStation={primaryDestination}
            setDestinationStation={handleUpdatePrimaryDestination}
            onContinue={handleContinueToBooking}
            onBack={() => setCurrentScreen('home')}
            onOpenMyTickets={() => setCurrentScreen('my_tickets')}
          />
        )}

        {/* Screen 3: Group Booking Screen with Same Destination Stepper & Blank Co-passengers */}
        {currentScreen === 'book' && (
          <BookTripScreen
            originStation={originStation}
            setOriginStation={setOriginStation}
            primaryDestination={primaryDestination}
            setPrimaryDestination={setPrimaryDestination}
            setTravellers={setTravellers}
            onProceedToPay={handleProceedToPay}
            onBack={() => setCurrentScreen('station_select')}
            onOpenMyTickets={() => setCurrentScreen('my_tickets')}
          />
        )}

        {/* Screen 4: Processing Stepper */}
        {currentScreen === 'processing' && (
          <ProcessingScreen
            originStation={originStation}
            travellers={travellers}
            onComplete={handleProcessingComplete}
          />
        )}

        {/* Screen 5: Trip Confirmed Screen (ONE Grouped Trip Card with all passengers) */}
        {currentScreen === 'confirmed' && confirmedTrip && (
          <TripConfirmedScreen
            trip={confirmedTrip}
            onViewQR={handleViewQR}
            onOpenMyTickets={() => setCurrentScreen('my_tickets')}
            onGoHome={() => setCurrentScreen('home')}
            onCancelTicket={handleCancelTicket}
          />
        )}

        {/* Screen 6: View-Only E-Ticket QR Screen with Passenger Switcher & WhatsApp Share */}
        {currentScreen === 'friend_qr' && selectedTicketForQR && (
          <FriendQRScreen
            ticket={selectedTicketForQR}
            allTripTickets={currentTripTickets}
            onSelectTicket={(t) => setSelectedTicketForQR(t)}
            onBack={() => {
              if (confirmedTrip) {
                setCurrentScreen('confirmed');
              } else {
                setCurrentScreen('my_tickets');
              }
            }}
          />
        )}

        {/* Screen 7: My Tickets Screen (Recreating Screenshot 1) */}
        {currentScreen === 'my_tickets' && (
          <MyTicketsScreen
            upcomingTrips={upcomingTrips}
            pastTickets={pastTickets}
            onBack={() => setCurrentScreen('home')}
            onGoHome={() => setCurrentScreen('home')}
            onViewQR={handleViewQR}
            onCancelTicket={handleCancelTicket}
          />
        )}
      </PhoneFrame>
    </div>
  );
}

export default App;
