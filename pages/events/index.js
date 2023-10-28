import EventList from "@/components/events/event-list";
import { getAllEvents } from "@/helpers/api-util";
import EventsSearch from "@/components/events/events-search";
import { useRouter } from "next/router";
import Head from "next/head";

export default function AllEventsPage(props) {
    const { events } = props;
    const router = useRouter();

    const findEventsHandler = (year, month) => router.push(`/events/${year}/${month}`);

    return (
        <>
            <Head>
                <title>All Events</title>
                <meta name="description" content="Events page example" />
            </Head>
            <EventsSearch onSearch={findEventsHandler} />
            <EventList items={events} />
        </>
    );
}

export async function getStaticProps() {
    const events = await getAllEvents();

    return {
        props: {
            events: events,
        },
        revalidate: 60,
    };
}
