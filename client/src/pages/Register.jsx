import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "../services/auth";
import { useMessagesContext } from "../hooks/MessagesContext";
import { useAuth } from "../hooks/useAuth";

import { Box, Button, Container, Form, Heading, Icon } from "react-bulma-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { validateEmail } from "../services/validation";

export const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { addMessage } = useMessagesContext();
  const { logout } = useAuth();

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email) {
        addMessage(`Įveskite el. paštą.`);
        return;
      }

      if (email.indexOf("@") === -1) {
        addMessage(`El. pašte pamiršote įrašyti @.`);
        return;

      }

      if (!validateEmail(email)) {
        addMessage(`Klaida! Prašome įvesti galiojantį el. paštą.`);
        return;
      }

      if (!password) {
        addMessage(`Įveskite slaptažodį.`);
        return;
      }

      if (password.length < 8) {
        addMessage(`Slaptažodį turi sudaryti ne mažiau kaip 8 simboliai.`);
        return;
      }

      console.log(password.length);

      const res = await Auth.register(email, password);

      if (res.error) {
        console.warn("Bad payload");
        addMessage(`Klaida: ${res.error}`);
        logout();
        return;
      }

      addMessage("Registracija sėkminga. Galite prisijungti naudodami savo el. paštą ir slaptažodį.");

      navigate("/login");

    }
    catch (err) {
      console.log({ err });
      addMessage(`Klaida: ${err}`);
      logout();
    }

  };

  return (
    <Container >
      <Heading>
        Registracijos forma
      </Heading>
      <Heading subtitle>
        Įveskite savo el. paštą ir slaptažodį.
      </Heading>

      <Box style={{ width: 400, margin: 'auto' }}
        as="form" onSubmit={handleSubmit}
      >
        <Form.Field>
          <Form.Label>El. paštas</Form.Label>
          <Form.Control>
            <Form.Input
              placeholder="testas@testas.com"
              name="email"
              type="email"
              required
              value={email}
              onChange={onEmailChange}
            />
            <Icon align="left">
              <FontAwesomeIcon icon={faEnvelope} />
            </Icon>
          </Form.Control>
        </Form.Field>
        <Form.Field>
          <Form.Label>Slaptažodis</Form.Label>
          <Form.Control>
            <Form.Input
              placeholder="Slaptažodis"
              name="password"
              type="password"
              required
              minLength={8}
              onChange={onPasswordChange}
            />
            <Icon align="left">
              <FontAwesomeIcon icon={faLock} />
            </Icon>
          </Form.Control>
        </Form.Field>
        <Button.Group>
          <Button
            fullwidth
            rounded
            color="primary"
            type="submit"
            disabled={!email || !password}
            onClick={handleSubmit}
          >Registracija</Button>
        </Button.Group>
      </Box>

    </Container >
  );
};