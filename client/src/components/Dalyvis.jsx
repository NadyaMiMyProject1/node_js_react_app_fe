import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Columns } from "react-bulma-components";
import { useAuth } from "../hooks/useAuth";
import { useMessagesContext } from "../hooks/MessagesContext";

import { DalyviaiApi } from "../services/dalyviai-api";
import { useState } from "react";
import { UpdateDalyvis } from "./UpdateDalyvis";

export const Dalyvis = ({ dalyvisId, dalyvis, onRowUpdate }) => {
    const { token } = useAuth();
    const { addMessage } = useMessagesContext();

    const [isEditing, setEditing] = useState(false);

    const onDeleteDalyvis = async (e) => {
        e.preventDefault();
        try {
            if (window.confirm(`Norite ištrinti „${dalyvis.firstname} ${dalyvis.lastname}“?`)) {
                const dalyvis = await DalyviaiApi.deleteDalyviai(dalyvisId, token);

                if (dalyvis.error) {
                    throw new Error(dalyvis.error);
                }
                addMessage("Dalyvis pašalintas iš sąrašo.");

                onRowUpdate();
            }
        } catch (error) {
            addMessage(`Klaida: ${error}`);
        }
    }

    const onaaa = async (e) => {
        e.preventDefault();
        setEditing(true);
    }

    const onDalyvisUpdate = () => {
        setEditing(false);
        onRowUpdate();
    }

    const onDalyvisCancelUpdate = () => {
        setEditing(false);
    }

    return (
        <div>
            {(isEditing) ? (
                <UpdateDalyvis
                    key={dalyvis.id}
                    dalyvisId={dalyvis.id}
                    dalyvis={dalyvis}
                    onUpdated={onDalyvisUpdate}
                    onCancelUpdate={onDalyvisCancelUpdate}
                />
            ) : (
                <Columns className="table-row">
                    <Columns.Column>
                    </Columns.Column>
                    <Columns.Column>
                        {dalyvis.firstname}
                    </Columns.Column>
                    <Columns.Column>
                        {dalyvis.lastname}
                    </Columns.Column>
                    <Columns.Column>
                        {dalyvis.email}
                    </Columns.Column>
                    <Columns.Column>
                        {new Date(dalyvis.birth_date).toLocaleDateString()}
                    </Columns.Column>
                    <Columns.Column>
                        <span className="mx-3">
                            <FontAwesomeIcon icon={faPen} onClick={onaaa} />
                        </span>
                        <span className="mx-3">
                            <FontAwesomeIcon icon={faTrash}
                                onClick={onDeleteDalyvis}
                            />
                        </span>
                    </Columns.Column>
                </Columns>
            )
            }
        </div>
    );
};