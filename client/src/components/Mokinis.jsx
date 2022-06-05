import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Columns } from "react-bulma-components";
import { useAuth } from "../hooks/useAuth";
import { useMessagesContext } from "../hooks/MessagesContext";

import { MokiniaiApi } from "../services/mokiniai-api";
import { useState } from "react";
import { UpdateDalyvis } from "./UpdateMokinis";

export const Mokinis = ({ mokinisId, mokinis, onRowUpdate }) => {
    const { token } = useAuth();
    const { addMessage } = useMessagesContext();

    const [isEditing, setEditing] = useState(false);

    const onDeleteMokinis = async (e) => {
        e.preventDefault();
        try {
            if (window.confirm(`Norite ištrinti „${mokinis.firstname} ${mokinis.lastname}“?`)) {
                const mokinis = await MokiniaiApi.deleteMokiniai(mokinisId, token);

                if (mokinis.error) {
                    throw new Error(mokinis.error);
                }
                addMessage("Mokinys pašalintas iš sąrašo.");

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

    const onMokinisUpdate = () => {
        setEditing(false);
        onRowUpdate();
    }

    const onMokinisCancelUpdate = () => {
        setEditing(false);
    }

    return (
        <div>
            {(isEditing) ? (
                <UpdateMokinis
                    key={mokinis.id}
                    mokinisId={mokinis.id}
                    mokinis={mokinis}
                    onUpdated={onMokinisUpdate}
                    onCancelUpdate={onMokinisCancelUpdate}
                />
            ) : (
                <Columns className="table-row">
                    <Columns.Column>
                    </Columns.Column>
                    <Columns.Column>
                        {mokinis.firstname}
                    </Columns.Column>
                    <Columns.Column>
                        {mokinis.lastname}
                    </Columns.Column>
                    <Columns.Column>
                        {mokinis.email}
                    </Columns.Column>
                    <Columns.Column>
                        {new Date(mokinis.birth_date).toLocaleDateString()}
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