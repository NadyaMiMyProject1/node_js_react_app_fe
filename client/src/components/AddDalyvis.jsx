import { useState } from "react";
import { Button, Columns, Form, Icon } from "react-bulma-components";
import { useAuth } from "../hooks/useAuth";
import { useMessagesContext } from "../hooks/MessagesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { DalyviaiApi } from "../services/dalyviai-api";
import { validateEmail } from "../services/validation";
import { setFirstnameError, setLastnameError, setEmailError, setBirth_dateError } from "../services/dalyvioValidacija";

export const AddDalyvis = ({ onAdded }) => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [birth_date, setBirth_date] = useState('');
    const { token } = useAuth();

    const { addMessage } = useMessagesContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!firstname) {
            addMessage("Įrašykite vardą.");
            setFirstnameError(0, true);
            return;
        }
        setFirstnameError(0, false);

        if (!lastname) {
            addMessage("Įrašykite pavardę.");
            setLastnameError(0, true);
            return;
        }
        setLastnameError(0, false);

        if (!email) {
            addMessage("Įrašykite el. paštą.");
            setEmailError(0, true);
            return;
        }

        if (!validateEmail(email)) {
            addMessage(`Klaida! Prašome įvesti galiojantį el. paštą.`);
            setEmailError(0, true);
            return;
        }
        setEmailError(0, false);

        if (!birth_date) {
            addMessage("Klaida! Įrašykite gimimo datą.");
            setBirth_dateError(0, true);
            return;
        }

        if (birth_date.length !== 10) {
            addMessage("Pasitikrinkite, ar gerai įrašėte gimimo datą. Formatas YYYY-MM-DD.");
            setBirth_dateError(0, true);
            return;
        }

        if (new Date(birth_date).toLocaleDateString() === 'Invalid Date') {
            addMessage("Klaida! Įrašykite gimimo datą formatu YYYY-MM-DD.");
            setBirth_dateError(0, true);

            return;
        }

        const dalyvioMetai = new Date(birth_date).getFullYear();
        console.log(dalyvioMetai);
        console.log(new Date(birth_date).toLocaleDateString());
        if (dalyvioMetai < 1900) {
            addMessage("Pasitikrinkite, ar gerai įrašėte gimimo datą. Formatas YYYY-MM-DD.");
            setBirth_dateError(0, true);
            return;
        }

        const einamieji_metai = new Date().getFullYear();
        const amzius = einamieji_metai - dalyvioMetai;

        if (amzius < 18) {
            addMessage("Dalyviai turi būti pilnamečiai.");
            setBirth_dateError(0, true);
            return;
        }

        setBirth_dateError(0, false);

        try {
            const dalyvis = {
                firstname,
                lastname,
                email,
                birth_date
            };
            const result = await DalyviaiApi.addDalyviai(dalyvis, token);

            if (result.error) {
                throw new Error(dalyvis.error);
            }
            addMessage("Dalyvis pridėtas.");

            onAdded();
        } catch (error) {
            addMessage(`Klaida: ${error}`);
        }
    }

    return (
        <Columns>
            <Columns.Column>
                &nbsp;
            </Columns.Column>
            <Columns.Column>
                <Form.Input
                    value={firstname}
                    title="Vardas"
                    placeholder="Vardas"
                    onChange={(e) => setFirstname(e.target.value)}
                    id="firstName_0"
                />
            </Columns.Column>

            <Columns.Column>
                <Form.Input
                    value={lastname}
                    title="Pavardė"
                    placeholder="Pavardė"
                    onChange={(e) => setLastname(e.target.value)}
                    id="lastName_0"
                />
            </Columns.Column>

            <Columns.Column>
                <Form.Input
                    value={email}
                    title="El. paštas"
                    placeholder="El. paštas"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    id="email_0"
                />
            </Columns.Column>

            <Columns.Column>
                <Form.Input
                    value={birth_date}
                    title="Gimimo data"
                    placeholder="Gimimo data"
                    onChange={(e) => setBirth_date(e.target.value)}
                    id="birth_date_0"
                />
            </Columns.Column>
            <Columns.Column>
                <Button
                    rounded
                    color="primary"
                    type="submit"
                    onClick={handleSubmit}
                ><Icon align="left">
                        <FontAwesomeIcon icon={faPlus} />
                    </Icon>
                </Button>
            </Columns.Column>
        </Columns>

    )
};
