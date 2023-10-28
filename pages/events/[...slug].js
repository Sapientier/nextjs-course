import { getFilteredEvents } from "@/helpers/api-util";
import Head from "next/head";
import EventList from "@/components/events/event-list";
import ResultsTitle from "@/components/events/results-title";
import Button from "@/components/ui/button";
import ErrorAlert from "@/components/ui/error-alert";

export default function FilteredEventsPage(props) {
    const pageHeadData = (
        <Head>
            <title>Filtered Events</title>
            <meta name="description" content={`All events for ${props.date.month}/${props.date.year}.`} />
        </Head>
    );

    if (props.hasError) {
        return (
            <>
                {pageHeadData}
                <ErrorAlert>
                    <p>Invalid filter. Please adjust your values!</p>
                </ErrorAlert>
                <div className="center">
                    <Button link="/events">Show All Events</Button>
                </div>
            </>
        );
    }

    const filteredEvents = props.events;

    if (!filteredEvents || filteredEvents.length === 0) {
        return (
            <>
                {pageHeadData}
                <ErrorAlert>
                    <p>No events found for the chosen filter!</p>
                </ErrorAlert>
                <div className="center">
                    <Button link="/events">Show All Events</Button>
                </div>
            </>
        );
    }

    const date = new Date(props.date.year, props.date.month - 1);

    return (
        <>
            {pageHeadData}
            <ResultsTitle date={date} />
            <EventList items={filteredEvents} />
        </>
    );
}

export async function getServerSideProps(context) {
    const { params } = context;

    const filteredData = params.slug;

    if (!filteredData) {
        return <p className="center">Loading...</p>;
    }

    const filteredYear = filteredData[0];
    const filteredMonth = filteredData[1];
    const numYear = +filteredYear;
    const numMonth = +filteredMonth;

    if (isNaN(numYear) || isNaN(numMonth) || numYear > 2030 || numYear < 2021 || numMonth < 1 || numMonth > 12) {
        return {
            props: {
                hasError: true,
            },
            // notFound: true,
            // redirect: {
            //     destination: "/error",
            // },
        };
    }

    const filteredEvents = await getFilteredEvents({
        year: numYear,
        month: numMonth,
    });

    return {
        props: {
            events: filteredEvents,
            date: {
                year: numYear,
                month: numMonth,
            },
        },
    };
}
