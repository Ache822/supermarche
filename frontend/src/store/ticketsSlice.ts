import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { JobTicket } from '../types';

interface TicketsState {
  activeTickets: JobTicket[];
  selectedTicketId: string | null;
}

const initialTickets: JobTicket[] = [];

const initialState: TicketsState = {
  activeTickets: initialTickets,
  selectedTicketId: null,
};

export const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    addTicket: (state, action: PayloadAction<JobTicket>) => {
      state.activeTickets.unshift(action.payload);
      state.selectedTicketId = action.payload.id;
    },
    setSelectedTicket: (state, action: PayloadAction<string>) => {
      state.selectedTicketId = action.payload;
    },
    updateTicketStatus: (state, action: PayloadAction<{ id: string; status: JobTicket['status']; notes?: string }>) => {
      const ticket = state.activeTickets.find((t) => t.id === action.payload.id);
      if (ticket) {
        ticket.status = action.payload.status;
        if (action.payload.notes) {
          ticket.notes = action.payload.notes;
        }
      }
    },
  },
});

export const { addTicket, setSelectedTicket, updateTicketStatus } = ticketsSlice.actions;
export default ticketsSlice.reducer;
