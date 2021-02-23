export interface MnemonicCardData {
    id: number;
    title: string;
    description: string;
    types: string[];
}

export interface CardsDetails {
    cards: MnemonicCardData[];
    total: number;
}

export class BackendApi {
    FAKE_DATA = {
        cards: [
            {
                description:
                    "Explanation: to remember the names of the Great Lakes\nHuron, Ontario, Michigan, Erie, Superior",
                id: 1,
                title: "HOMES",
                types: ["acronym", "text", "some", "thing", "here", "as", "we", "knew"],
            },
            {
                description:
                    "What is the order of the planets in our solar system? Use one of these tools to easily learn this and you\u2019ll never forget it again!\nThe first letter of each word gives you the first letter of the planets, in order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
                id: 2,
                title: "My Very Educated Mother Just Served Us Noodles",
                types: ["acronym", "text", "some", "thing", "here", "as", "we", "knew"],
            },
            {
                description:
                    "What is the order of the planets in our solar system? Use one of these tools to easily learn this and you\u2019ll never forget it again!\nThe first letter of each word gives you the first letter of the planets, in order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
                id: 3,
                title: "My Very Educated Mother Just Served Us Noodles 2",
                types: ["acronym", "text", "some", "thing", "here", "as", "we", "knew"],
            },
            {
                description:
                    "What is the order of the planets in our solar system? Use one of these tools to easily learn this and you\u2019ll never forget it again!\nThe first letter of each word gives you the first letter of the planets, in order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
                id: 4,
                title: "My Very Educated Mother Just Served Us Noodles 3",
                types: ["acronym", "text", "some", "thing", "here", "as", "we", "knew"],
            },
            {
                description:
                    "What is the order of the planets in our solar system? Use one of these tools to easily learn this and you\u2019ll never forget it again!\nThe first letter of each word gives you the first letter of the planets, in order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
                id: 5,
                title: "My Very Educated Mother Just Served Us Noodles 4",
                types: ["acronym", "text", "some", "thing"],
            },
            {
                description:
                    "What is the order of the planets in our solar system? Use one of these tools to easily learn this and you\u2019ll never forget it again!\nThe first letter of each word gives you the first letter of the planets, in order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
                id: 6,
                title: "My Very Educated Mother Just Served Us Noodles 5",
                types: ["acronym", "text", "some", "thing", "here", "as", "we", "knew"],
            },
            {
                description:
                    "What is the order of the planets in our solar system? Use one of these tools to easily learn this and you\u2019ll never forget it again!\nThe first letter of each word gives you the first letter of the planets, in order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
                id: 7,
                title: "My Very Educated Mother Just Served Us Noodles 6",
                types: ["acronym", "text", "some", "thing", "here", "as", "we", "knew"],
            },
            {
                description:
                    "What is the order of the planets in our solar system? Use one of these tools to easily learn this and you\u2019ll never forget it again!\nThe first letter of each word gives you the first letter of the planets, in order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
                id: 8,
                title: "My Very Educated Mother Just Served Us Noodles 7",
                types: ["acronym", "text", "some", "thing", "here", "as", "we", "knew"],
            },
            {
                description:
                    "What is the order of the planets in our solar system? Use one of these tools to easily learn this and you\u2019ll never forget it again!\nThe first letter of each word gives you the first letter of the planets, in order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
                id: 9,
                title: "My Very",
                types: ["acronym", "text", "some", "thing", "here", "as", "we", "knew"],
            },
            {
                description:
                    "What is the order of the planets in our solar system? Use one of these tools to easily learn this and you\u2019ll never forget it again!\nThe first letter of each word gives you the first letter of the planets, in order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
                id: 10,
                title: "Educated Mother",
                types: ["acronym", "text", "some", "thing", "here", "as", "we", "knew"],
            },
            {
                description:
                    "What is the order of the planets in our solar system? Use one of these tools to easily learn this and you\u2019ll never forget it again!\nThe first letter of each word gives you the first letter of the planets, in order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
                id: 11,
                title: "Just Served Us ",
                types: ["acronym", "text", "some", "thing", "here", "as", "we", "knew"],
            },
            {
                description:
                    "What is the order of the planets in our solar system? Use one of these tools to easily learn this and you\u2019ll never forget it again!\nThe first letter of each word gives you the first letter of the planets, in order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
                id: 12,
                title: "Noodles",
                types: ["acronym", "text", "some", "thing", "here", "as", "we", "knew"],
            },
        ],
        total: 12,
    };

    async cardsList(page: number, pageSize: number): Promise<CardsDetails> {
        const fromIdx = (page - 1) * pageSize;
        const toIdx = page * pageSize;
        return {
            cards: this.FAKE_DATA["cards"].slice(fromIdx, toIdx),
            total: this.FAKE_DATA["total"],
        };
    }
}

export const backendApi: BackendApi = new BackendApi();
