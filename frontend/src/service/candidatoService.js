const API_URL = import.meta.env.VITE_API_URL || "/funcionarios";

function normalizarFuncionario(funcionario) {
        return {
                ...funcionario,
                departamento: funcionario.departamento?.descricao ?? funcionario.departamento ?? "",
                status: funcionario.status?.descricao ?? funcionario.status ?? "",
        };
}

async function requisicao(path = "", options = {}) {
        const response = await fetch(`${API_URL}${path}`, {
                headers: {
                        "Content-Type": "application/json",
                        ...options.headers,
                },
                ...options,
        });

        if (!response.ok) {
                const mensagem = await response.text();
                throw new Error(mensagem || `Erro na API: ${response.status}`);
        }

        if (response.status === 204) return null;

        const contentType = response.headers.get("content-type") || "";
        return contentType.includes("application/json")
                ? response.json()
                : response.text();
}

export async function buscarFuncionarios() {
        const funcionarios = await requisicao();
        return funcionarios.map(normalizarFuncionario);
}

export async function buscarFuncionario(id) {
        return normalizarFuncionario(await requisicao(`/${id}`));
}

export async function criarFuncionario(dados) {
        return normalizarFuncionario(
                await requisicao("", {
                        method: "POST",
                        body: JSON.stringify(dados),
                })
        );
}

export async function atualizarFuncionario(id, dados) {
        return normalizarFuncionario(
                await requisicao(`/${id}`, {
                        method: "PUT",
                        body: JSON.stringify(dados),
                })
        );
}

export async function atualizarFuncionarioParcialmente(id, dados) {
        return normalizarFuncionario(
                await requisicao(`/${id}`, {
                        method: "PATCH",
                        body: JSON.stringify(dados),
                })
        );
}

export async function excluirFuncionario(id) {
        await requisicao(`/${id}`, { method: "DELETE" });
}

export const buscarCandidatos = buscarFuncionarios;
