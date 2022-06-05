import { useState } from "react";
import { Button, Columns, Form, Icon } from "react-bulma-components";
import { useAuth } from "../hooks/useAuth";
import { useMessagesContext } from "../hooks/MessagesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { MokiniaiApi } from "../services/mokiniai-api";
import { validateEmail } from "../services/validation";
import { setFirstnameError, setLastnameError, setEmailError, setBirth_dateError } from "../services/mokinioValidacija";

export const UpdateMokinis = ({ mokinis, onUpdated, onCancelUpdate }) => {
    const [firstname, setFirstname] = useState(mokinis.firstname);
    const [lastname, setLastname] = useState(mokinis.lastname);
    const [email, setEmail] = useState(mokinis.email);
    const [birth_date, setBirth_date] = useState(new Date(mokinis.birth_date).toLocaleDateString());
    const { token } = useAuth();

    const { addMessage } = useMessagesContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!firstname) {
            addMessage("Įrašykite vardą.");
            setFirstnameError(mokinis.id, true);
            return;
        }

        setFirstnameError(mokinis.id, false);

        if (!lastname) {
            addMessage("Įrašykite pavardę.");
            setLastnameError(mokinis.id, true);
            return;
        }

        setLastnameError(mokinis.id, false);

        if (!email) {
            addMessage("Įrašykite el. paštą.");
            setEmailError(mokinis.id, true);
            return;
        }

        if (!validateEmail(email)) {
            addMessage(`Klaida! Prašome įvesti galiojantį el. paštą.`);
            setEmailError(mokinis.id, true);
            return;
        }

        setEmailError(mokinis.id, false);

        if (!birth_date) {
            addMessage("Klaida! Įrašykite gimimo datą.");
            setBirth_dateError(mokinis.id, true);
            return;
        }

        if (new Date(birth_date).toLocaleDateString() === 'Invalid Date') {
            addMessage("Klaida! Įrašykite gimimo datą formatu YYYY-MM-DD.");

            setBirth_dateError(mokinis.id, true);

            return;
        }

        const mokinio_metai = new Date(birth_date).getFullYear();
        const einamieji_metai = new Date().getFullYear();
        if (einamieji_metai - mokinio_metai < 0) {
            addMessage("Mokinis dar negimęs");
            setBirth_dateError(mokinis.id, true);
            return;
        }

        setBirth_dateError(mokinis.id, false);

        try {
            const mokinisToUpdate = {
                firstname,
                lastname,
                email,
                birth_date: new Date(birth_date).toLocaleDateString(),
                id: dalyvis.id
            };
            const result = await MokiniaiApi.updateDalyviai(mokinisToUpdate, token);

            if (result.error) {
                throw new Error(mokinis.error);
            }
            addMessage("Mokinis atnaujintas.");

            onUpdated();
        } catch (error) {
            addMessage(`Klaida: ${error}`);
        }
    }

    return (
        <Columns className="table-row">
            <Columns.Column>
                &nbsp;
            </Columns.Column>
            <Columns.Column>
                <Form.Input
                    value={firstname}
                    title="Vardas"
                    placeholder="Vardas"
                    onChange={(e) => setFirstname(e.target.value)}
                    id={`firstName_${mokinis.id}`}
                />
            </Columns.Column>

            <Columns.Column>
                <Form.Input
                    value={lastname}
                    title="Pavardė"
                    placeholder="Pavardė"
                    onChange={(e) => setLastname(e.target.value)}
                    id={`lastName_${dalyvis.id}`}
                />
            </Columns.Column>

            <Columns.Column>
                <Form.Input
                    value={email}
                    title="El. paštas"
                    placeholder="El. paštas"
                    onChange={(e) => setEmail(e.target.value)}
                    id={`email_${mokinis.id}`}
                />
            </Columns.Column>

            <Columns.Column>
                <Form.Input
                    value={birth_date}
                    title="Gimimo data"
                    placeholder="Gimimo data"
                    onChange={(e) => setBirth_date(e.target.value)}
                    id={`birth_date_${dalyvis.id}`}
                />
            </Columns.Column>
            <Columns.Column>
                <span className="mx-1">
                    <Button
                        rounded
                        color="primary"
                        type="submit"
                        onClick={handleSubmit}
                    ><Icon align="left"
                        title="Išsaugoti pakeitimus."
                    >
                            <FontAwesomeIcon icon={faSave} />
                        </Icon>
                    </Button>
                </span>
                <span className="mx-1">
                    <Button
                        rounded
                        color="secondary"
                        type="submit"
                        onClick={onCancelUpdate}
                    ><Icon align="left"
                        title="Nesaugoti pakeitimų."
                    >
                            <FontAwesomeIcon icon={faTimes} />
                        </Icon>
                    </Button>
                </span>
            </Columns.Column>
        </Columns >
    )
};
