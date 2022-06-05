import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMessagesContext } from "../hooks/MessagesContext";
import { useAuth } from "../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons'

import { Box, Button, Container, Form, Heading, Icon } from "react-bulma-components";

export const Login = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { addMessage, removeMessage } = useMessagesContext();

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
        addMessage(`Įrašykite el. paštą.`);
        return;

      }

      if (!password) {
        addMessage(`Įrašykite slaptažodį.`);
        return;
      }

      const res = await login(email, password);
      console.log({ res });
      if (res.error) {
        console.log(`Klaida: ${res.error}.`);
        addMessage(`Klaida! Neteisingas el. paštas arba slaptažodis.`);
        logout();
        return;
      }
      if (!res.token) {
        console.warn("No token");
        addMessage(`Klaida! Neteisingas el. paštas arba slaptažodis.`);
        logout();
        return;
      }
      removeMessage();

      navigate("/");
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
        Prisijungimas
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
              placeholder="Password"
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
          >Prisijungti</Button>
        </Button.Group>
      </Box>

    </Container>
  );
};