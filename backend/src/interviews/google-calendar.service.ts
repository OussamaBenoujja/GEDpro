import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import * as path from 'path';

@Injectable()
export class GoogleCalendarService {
    private readonly logger = new Logger(GoogleCalendarService.name);
    private calendar;

    constructor() {
        // Path to the Service Account Key File
        // Ensure this file exists in your root or use an ENV variable
        const keyFilePath = path.join(process.cwd(), 'focal-limiter-482220-q9-68dbb25bb631.json');

        const auth = new google.auth.GoogleAuth({
            keyFile: keyFilePath,
            scopes: ['https://www.googleapis.com/auth/calendar'],
        });

        this.calendar = google.calendar({ version: 'v3', auth });
    }

    async createEvent(
        title: string,
        description: string,
        startTime: Date,
        endTime: Date,
        attendees: string[],
    ): Promise<{ id: string; meetingLink?: string }> {
        try {
            this.logger.log(`Creating Google Calendar Event: ${title}`);

            const event = {
                summary: title,
                description: description,
                start: {
                    dateTime: startTime.toISOString(),
                    timeZone: 'UTC', // Adjust as needed
                },
                end: {
                    dateTime: endTime.toISOString(),
                    timeZone: 'UTC',
                },
                // attendees: attendees.map(email => ({ email })), // Disabled: Service Accounts cannot invite without Domain-Wide Delegation
                conferenceData: {
                    createRequest: {
                        requestId: `meet-${Date.now()}`,
                    },
                },
            };

            const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
            this.logger.log(`Using Calendar ID: ${calendarId}`);
            const response = await this.calendar.events.insert({
                calendarId: calendarId, // Use configured calendar or default to primary
                requestBody: event,
                conferenceDataVersion: 1, // Required to create Google Meet links
            });

            this.logger.log(`Event created: ${response.data.htmlLink}`);
            const meetingLink = response.data.conferenceData?.entryPoints?.find(ep => ep.entryPointType === 'video')?.uri;
            if (meetingLink) {
                this.logger.log(`Google Meet Link: ${meetingLink}`);
            }

            return {
                id: response.data.id,
                meetingLink: meetingLink,
            };
        } catch (error) {
            this.logger.error('Error creating Google Calendar event', error);
            // Fallback: return a mock ID so the flow doesn't break if API fails
            return { id: `error_event_${Date.now()}` };
        }
    }

    async deleteEvent(eventId: string): Promise<void> {
        try {
            this.logger.log(`Deleting Google Calendar Event: ${eventId}`);
            await this.calendar.events.delete({
                calendarId: 'primary',
                eventId: eventId,
            });
            this.logger.log('Event deleted successfully');
        } catch (error) {
            this.logger.error('Error deleting Google Calendar event', error);
        }
    }
}
