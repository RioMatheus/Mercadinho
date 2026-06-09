export function apenasNumeros(valor) {
    return String(valor || "").replace(/\D/g, "");
}

export function formatarMoeda(valor) {
    const numero = Number(valor || 0);

    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

export function formatarCampoMoeda(valor) {
    const numeros = apenasNumeros(valor);

    if (!numeros) {
        return "";
    }

    const numero = Number(numeros) / 100;

    return numero.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

export function moedaParaNumero(valor) {
    if (!valor) {
        return 0;
    }

    return Number(
        String(valor)
            .replace(/\./g, "")
            .replace(",", ".")
    );
}

export function formatarData(valor) {
    if (!valor) {
        return "-";
    }

    return new Date(`${valor}T00:00:00`).toLocaleDateString("pt-BR");
}
