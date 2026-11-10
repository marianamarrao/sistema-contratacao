import { useState } from "react";

// ARQUIVO DE TESTE: viola rules-of-hooks de propósito para provar que o CI falha
// e que o CD não é acionado. Não deve ser mesclado na main.
export default function TesteLint({ ativo }) {
        if (ativo) {
                const [valor] = useState(0);
                return <span>{valor}</span>;
        }
        return null;
}
