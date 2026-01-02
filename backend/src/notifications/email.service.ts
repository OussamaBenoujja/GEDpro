import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { createEvent, EventAttributes } from 'ics';
import * as util from 'util';
import * as path from 'path';

const createEventAsync = util.promisify(createEvent);

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587') || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendInterviewInvite(
        to: string[] = [],
        title: string,
        description: string,
        startTime: Date,
        endTime: Date,
        organizerName: string = 'GEDPro HR',
        organizerEmail: string = 'no-reply@gedpro.com',
        meetingLink?: string,
    ) {
        if (!to || to.length === 0) return;

        try {
            this.logger.log(`Sending Interview Invite to: ${to.join(', ')}`);

            // 1. Generate ICS File
            const event: EventAttributes = {
                start: [
                    startTime.getFullYear(),
                    startTime.getMonth() + 1,
                    startTime.getDate(),
                    startTime.getHours(),
                    startTime.getMinutes(),
                ],
                end: [
                    endTime.getFullYear(),
                    endTime.getMonth() + 1,
                    endTime.getDate(),
                    endTime.getHours(),
                    endTime.getMinutes(),
                ],
                title: title,
                description:
                    description + (meetingLink ? `\n\nGoogle Meet: ${meetingLink}` : ''),
                location: meetingLink || 'Google Meet',
                url: meetingLink,
                organizer: { name: organizerName, email: organizerEmail },
                attendees: to.map((email) => ({ name: email, email })),
                status: 'CONFIRMED',
                busyStatus: 'BUSY',
            };

            const { error, value } = createEvent(event);
            if (error) {
                throw error;
            }

            // 2. Generate Google Calendar Link
            const formatTime = (date: Date) =>
                date.toISOString().replace(/-|:|\.\d+/g, '');
            const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description)}&dates=${formatTime(startTime)}/${formatTime(endTime)}`;

            // 3. Generate Premium HTML Template
            const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; }
                    .wrapper {
                        width: 100%;
                        table-layout: fixed;
                        background-color: #f4f4f4;
                        padding-bottom: 40px;
                    }
                    .webkit {
                        max-width: 600px;
                        margin: 0 auto;
                        background-image: url('cid:office_bg');
                        background-size: cover;
                        background-position: center;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 8px 16px rgba(0,0,0,0.2);
                    }
                    .overlay {
                        background-color: rgba(255, 255, 255, 0.60);
                        margin: 20px;
                        border-radius: 8px;
                        overflow: hidden;
                    }
                    .header {
                        text-align: center;
                        padding: 30px 20px;
                        background: linear-gradient(135deg, #001f3f 0%, #0074D9 100%);
                    }
                    .header img {
                        max-width: 120px;
                        height: auto;
                        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
                    }
                    .content {
                        padding: 40px 30px;
                        text-align: center;
                        color: #333333;
                    }
                    h1 {
                        margin: 0 0 20px;
                        color: #001f3f;
                        font-size: 24px;
                        font-weight: 700;
                    }
                    p {
                        font-size: 16px;
                        line-height: 1.6;
                        color: #555555;
                        margin-bottom: 30px;
                    }
                    .info-card {
                        background-color: #f8f9fa;
                        border-left: 5px solid #0074D9;
                        padding: 20px;
                        text-align: left;
                        margin-bottom: 30px;
                        border-radius: 4px;
                    }
                    .info-row {
                        margin-bottom: 12px;
                        font-size: 15px;
                        display: flex;
                        align-items: center;
                    }
                    .info-row:last-child { margin-bottom: 0; }
                    .info-label { font-weight: bold; color: #001f3f; min-width: 60px; }
                    .icon { display: inline-block; width: 16px; height: 16px; margin-right: 8px; fill: #0074D9; }

                    .actions {
                        text-align: center;
                        padding: 10px 0;
                    }
                    .btn {
                        display: inline-block;
                        padding: 14px 24px;
                        text-decoration: none;
                        border-radius: 50px;
                        font-weight: bold;
                        text-align: center;
                        font-size: 16px;
                        transition: background-color 0.3s;
                        margin: 10px;
                        line-height: 24px; 
                    }
                    .btn-primary {
                        background-color: #0074D9;
                        color: #ffffff !important;
                        box-shadow: 0 4px 6px rgba(0, 116, 217, 0.3);
                    }
                    .btn-secondary {
                        background-color: #ffffff;
                        color: #001f3f !important;
                        border: 2px solid #001f3f;
                    }
                    .footer {
                        padding: 20px;
                        text-align: center;
                        font-size: 12px;
                        color: #999999;
                        background-color: #f4f4f4;
                    }
                </style>
            </head>
            <body>
                <div class="wrapper">
                    <div class="webkit">
                        <div class="overlay">
                            <div class="header">
                                <img src="cid:logo_cedpro" alt="GEDPro">
                            </div>
                            <div class="content">
                                <h1>Interview Invitation</h1>
                                <p>Hello,</p>
                                <p>You have been invited to an interview with ${organizerName}. Please see the details below.</p>

                                <div class="info-card">
                                    <div class="info-row">
                                        <span class="info-label">Title:</span> ${title}
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Date:</span> ${startTime.toDateString()}
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Time:</span> ${startTime.toTimeString().split(' ')[0]} - ${endTime.toTimeString().split(' ')[0]} (UTC)
                                    </div>
                                </div>

                                <div class="actions">
                                    ${meetingLink
                    ? `<a href="${meetingLink}" class="btn btn-primary">
                                        <img src="cid:icon_meeting" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px; border: 0;" alt="Video" />
                                        <span style="vertical-align: middle;">Join Meeting</span>
                                    </a>`
                    : `<a href="#" class="btn btn-primary" style="opacity: 0.6; cursor: not-allowed;">
                                        <img src="cid:icon_meeting" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px; border: 0;" alt="Clock" />
                                        <span style="vertical-align: middle;">Meeting Link Pending</span>
                                    </a>`
                }
                                    <a href="${googleCalUrl}" class="btn btn-secondary">
                                        <img src="cid:icon_calendar" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px; border: 0;" alt="Calendar" />
                                        <span style="vertical-align: middle;">Add to Calendar</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="footer">
                        &copy; ${new Date().getFullYear()} ${organizerName}.<br>
                        Automated email sent via GEDPro.
                    </div>
                </div>
            </body>
            </html>
            `;

            // 4. Send Email with Attachments
            const mailOptions = {
                from: `"${organizerName}" <${process.env.SMTP_USER || organizerEmail}>`,
                to: to,
                subject: `Interview Invitation: ${title}`,
                html: htmlContent,
                attachments: [
                    {
                        filename: 'invite.ics',
                        content: value,
                        contentType: 'text/calendar',
                    },
                    {
                        filename: 'logo.png',
                        path: path.join(__dirname, '..', 'assets', 'logo.png'),
                        cid: 'logo_cedpro',
                    },
                    {
                        filename: 'office.jpeg',
                        path: path.join(__dirname, '..', 'assets', 'office.jpeg'),
                        cid: 'office_bg',
                    },
                    {
                        filename: 'meeting.png',
                        path: path.join(__dirname, '..', 'assets', 'meeting.png'),
                        cid: 'icon_meeting',
                        contentType: 'image/png',
                    },
                    {
                        filename: 'calendar.png',
                        path: path.join(__dirname, '..', 'assets', 'calendar.png'),
                        cid: 'icon_calendar',
                        contentType: 'image/png',
                    },
                ],
                icalEvent: {
                    filename: 'invite.ics',
                    method: 'REQUEST',
                    content: value,
                },
            };

            await this.transporter.sendMail(mailOptions);
            this.logger.log('Email sent successfully');
        } catch (error) {
            this.logger.error('Error sending email invite', error);
        }
    }
}
