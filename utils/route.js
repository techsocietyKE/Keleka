import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Appointment from "@/models/appointment";
import { appointmentBookingEmailTemplate, gmailTransport } from "@/utils/mails";
import { getSession } from "next-auth/react";

export async function POST(req) {
    try {
        const { appointmenttitle, appointmentdate, appointmenttime, appointmentinfo, byfirstname, bylastname, phonenumber, userId } = await req.json();
        
        await connectMongoDB();
        const appointment = await Appointment.create({ appointmenttitle, appointmentdate, appointmenttime, appointmentinfo, byfirstname, bylastname, phonenumber, userId });

        const session = await getSession();
        const userEmail = session?.user?.email;
        console.log(userEmail) // Assuming you are using NextAuth

      gmailTransport().sendMail({
            from: userEmail,
            to: 'clammsey@gmail.com',
            subject: 'Booking Appointment',
            html: appointmentBookingEmailTemplate(appointment),
        }, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        return NextResponse.json({ message: "Appointment booked." }, { status: 201 });
    } catch (error) {
        // Return the actual error message
        return NextResponse.json(
            { message: error.message || "An error occurred while booking the appointment." },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectMongoDB();
        const appointments = await Appointment.find({});
        return NextResponse.json(appointments, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: error.message || "An error occurred while fetching appointments." },
            { status: 500 }
        );
    }
}

    
   
    