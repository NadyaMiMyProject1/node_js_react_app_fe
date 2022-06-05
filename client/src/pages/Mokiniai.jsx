import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useMessagesContext } from "../hooks/MessagesContext";
import { Columns, Container, Heading } from "react-bulma-components";
import { Mokinis } from "../components/Mokinis";
import { MokiniaiApi } from "../services/mokiniai-api";
import { AddMokinis } from "../components/AddMokinis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortAlphaDown, faSortAlphaUp } from "@fortawesome/free-solid-svg-icons";

export const Mokiniai = () => {
    const [mokiniai, setMokiniai] = useState();
    const { token } = useAuth();

    const [sortDir, setSortDir] = useState(1);
    const [sortBy, setSortBy] = useState('lastname');

    const toggleSorting = (by) => {
        if (sortBy !== by) {
            setSortBy(by);
            setSortDir(1);
        }
        else {
            setSortDir(-sortDir);
        }
    }

    const { addMessage, removeMessage } = useMessagesContext();

    const fetchMokiniai = async () => {

        addMessage("Užkraunamas mokinių sąrašas");
        // fetch mokinius from api
        try {
            const allMokiniai = await MokiniaiApi.getMokiniai(token);

            if (allMokiniai.error) {
                addMessage(`Klaida: ${allMokiniai.error}`);
                setMokiniai([]);
                return;
            }

            removeMessage();

            if (!allMokiniai || !allMokiniai.mokiniai || (allMokiniai.mokiniai && allMokiniai.mokiniai.length === 0)) {
                addMessage("Nėra mokinių.");
            }
            // save fetched mokiniai to local state
            setMokiniaii(allMokiniai.mokiniai);

        }
        catch (err) {
            console.log({ err });
            addMessage(`Klaida: ${err}`);
            setDalyviai([]);
        }
    };

    // fetch mokiniai list on component load
    useEffect(() => {
        fetchMokiniai();
    }, []);


    const parsedMokiniai =
        (mokiniai && mokiniai.length > 0) ?
            mokiniai
                .sort(function (a, b) {
                    if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return sortDir;
                    if (a[sortBy].toLowerCase() < b[sortBy].toLowerCase()) return -sortDir;
                    return 0;
                })
                .map((mokinis) => (
                    <Mokinis
                        key={mokinis.id}
                        mokinisId={mokinis.id}
                        mokinis={mokinis}
                        onRowUpdate={fetchMokiniai}
                    />
                )) : (
                <p>
                    ¯\_(ツ)_/¯
                </p>
            )
        ;

    return (
        <Container>
            <Heading>
                Marafono mokinių sąrašas

            </Heading>
            <Columns className="table-header">
                <Columns.Column>
                    &nbsp;
                </Columns.Column>
                <Columns.Column onClick={() => toggleSorting('firstname')}>
                    Vardas
                    {(sortBy === 'firstname') && (
                        <span className="mx-3">
                            {(sortDir === 1) ? (
                                <FontAwesomeIcon icon={faSortAlphaDown} />
                            ) : (
                                <FontAwesomeIcon icon={faSortAlphaUp} />
                            )}
                        </span>
                    )}
                </Columns.Column>
                <Columns.Column onClick={() => toggleSorting('lastname')}>
                    Pavardė
                    {(sortBy === 'lastname') && (
                        <span className="mx-3">
                            {(sortDir === 1) ? (
                                <FontAwesomeIcon icon={faSortAlphaDown} />
                            ) : (
                                <FontAwesomeIcon icon={faSortAlphaUp} />
                            )}
                        </span>
                    )}
                </Columns.Column>
                <Columns.Column onClick={() => toggleSorting('email')}>
                    El. paštas
                    {(sortBy === 'email') && (
                        <span className="mx-3">
                            {(sortDir === 1) ? (
                                <FontAwesomeIcon icon={faSortAlphaUp} />
                            ) : (
                                <FontAwesomeIcon icon={faSortAlphaDown} />
                            )}
                        </span>
                    )}
                </Columns.Column>
                <Columns.Column onClick={() => toggleSorting('birth_date')}>
                    Gimimo data
                    {(sortBy === 'birth_date') && (
                        <span className="mx-3">
                            {(sortDir === 1) ? (
                                <FontAwesomeIcon icon={faSortAlphaUp} />
                            ) : (
                                <FontAwesomeIcon icon={faSortAlphaDown} />
                            )}
                        </span>
                    )}
                </Columns.Column>
                <Columns.Column>
                    &nbsp;
                </Columns.Column>
            </Columns>
            {parsedMokiniai}
            <AddMokinis onAdded={fetchMokiniai}> </AddMokinis>
        </Container>
    );
};