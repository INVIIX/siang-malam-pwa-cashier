import { Input } from "@/components/ui/input";
import apiClient from "@/lib/apiClient";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useLocalStorage } from "react-use";
import { TCart, TTable } from "../helpers/cart-utils";
import { useQuery } from "@tanstack/react-query";

type TTableNumber = TTable & {
    isCartNotFinished: boolean
}

export default function CartTablePage() {
    const [carts] = useLocalStorage<TCart[]>('carts')
    const [tablesData, setTablesData] = useLocalStorage<TTableNumber[]>('tables');
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const { data } = useQuery({
        queryKey: [tablesData, search],
        queryFn: () => {
            const data = tablesData ?? [];
            const results = search ? data.filter(item =>
                String(item.number).toLowerCase().includes(search.toLowerCase())
            ) : data;
            return results.map((table: TTableNumber) => {
                const cart = carts?.filter((cartData) => cartData.table.id === table.id)[0] ?? { items: [] };
                table.isCartNotFinished = cart.items.length > 0;
                return table;
            });
        }
    })

    const getTablesData = async () => {
        try {
            const response = await apiClient
                .get('/datasheets/tables', {
                    params: {
                        per_page: 100,
                        order: 'number',
                        sort: 'asc'
                    }
                });
            const responseData = response.data;
            setTablesData(responseData.data);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getTablesData()
    }, [])

    return <>
        <section className="size-full flex flex-col">
            <div className="w-full h-auto relative p-4">
                <SearchIcon className="absolute top-1/2 -translate-y-1/2 ms-3 text-gray-500" />
                <Input type="search" className="ps-11 bg-white w-full" placeholder="Cari Meja"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            {
                !loading && <div className="w-full h-full flex-1 overflow-y-auto px-4 pb-4">
                    <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                        <NavLink to="/carts/0" className="text-center flex flex-col justify-center items-center leading-none p-3 whitespace-normal text-wrap h-auto shadow-sm bg-white rounded-lg">
                            <div className="font-bold text-sm/4">Bawa Pulang</div>
                        </NavLink>
                        {
                            data && data.map((table) => {
                                return <NavLink key={table.id} to={`/carts/${table.id}`} className="text-center flex flex-col justify-center items-center leading-none p-3 whitespace-normal text-wrap h-auto shadow-sm bg-white rounded-lg relative">
                                    <span className="text-xs text-foreground">Meja</span>
                                    <div className="font-bold text-lg">{table.number}</div>
                                    {table.isCartNotFinished && <div className="size-3 bg-red-500 absolute top-1 right-2 rounded-full"></div>}
                                </NavLink>
                            })
                        }
                    </div>
                </div>
            }
        </section>
    </>
}