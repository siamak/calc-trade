/* eslint-disable react/jsx-key */
import React from "react";
import {
	chakra,
	VStack,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	Badge,
} from "@chakra-ui/react";
import { useTable, usePagination, useSortBy } from "react-table";

const range = (len: number) => {
	const arr = [];
	for (let i = 0; i < len; i++) {
		arr.push(i);
	}
	return arr;
};

export interface ITrade {
	Id: number;
	openedAt: string;
	endAt: string;
	asset: string;
	side: number;
	margin: number;
	entry: number;
	stoploss: number;
	tp1: number;
	tp2: number;
	fee: number;
	riskorreward: string;
	amountROR: number;
	fundingfee: number;
	description: string;
}

const newTrade = (): ITrade => {
	return {
		Id: 1,
		openedAt: new Date().toDateString(),
		endAt: new Date().toDateString(),
		asset: "BTC/USDT",
		side: 0,
		margin: 250,
		entry: 41200,
		stoploss: 41100,
		tp1: 45500,
		tp2: 46000,
		fee: 0.2,
		riskorreward: "Reward",
		amountROR: 1000,
		fundingfee: 5.7,
		description: "",
	};
};

function makeData(...lens: any) {
	const makeDataLevel: any = (depth = 0) => {
		const len = lens[depth];
		return range(len).map((d) => {
			return {
				...newTrade(),
				subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
			};
		});
	};

	return makeDataLevel();
}

export default function BookTable() {
	const columns = React.useMemo(
		() => [
			{
				Header: "#",
				accessor: "Id",
			},

			{
				Header: "Opened At",
				accessor: "openedAt",
				Cell: ({ value }: any) => <Badge>{value}</Badge>,
			},

			{
				Header: "End At",
				accessor: "endAt",
				Cell: ({ value }: any) => <Badge>{value}</Badge>,
			},

			{
				Header: "Asset",
				accessor: "asset",
				Cell: ({ value }: any) => <Badge>{value}</Badge>,
			},

			{
				Header: "Side",
				accessor: "side",
				Cell: ({ value }: any) =>
					value === 0 ? (
						<Badge colorScheme={"red"}>SHORT</Badge>
					) : (
						<Badge colorScheme={"green"}>LONG</Badge>
					),
			},

			{
				Header: "Margin ($)",
				accessor: "margin",
				isNumeric: true,
				Cell: ({ value }: any) =>
					new Intl.NumberFormat("en-US", {
						style: "currency",
						currency: "USD",
					}).format(value),
			},

			{
				Header: "Entry ($)",
				accessor: "entry",
				isNumeric: true,
				Cell: ({ value }: any) =>
					new Intl.NumberFormat("en-US", {
						style: "currency",
						currency: "USD",
					}).format(value),
			},

			{
				Header: "Stoploss ($)",
				accessor: "stoploss",
				isNumeric: true,
				Cell: ({ value }: any) =>
					new Intl.NumberFormat("en-US", {
						style: "currency",
						currency: "USD",
					}).format(value),
			},

			{
				Header: "TP 1 ($)",
				accessor: "tp1",
				isNumeric: true,
				Cell: ({ value }: any) =>
					new Intl.NumberFormat("en-US", {
						style: "currency",
						currency: "USD",
					}).format(value),
			},

			{
				Header: "TP 2 ($)",
				accessor: "tp2",
				isNumeric: true,
				Cell: ({ value }: any) =>
					new Intl.NumberFormat("en-US", {
						style: "currency",
						currency: "USD",
					}).format(value),
			},

			{
				Header: "Amount",
				accessor: "amountROR",
				isNumeric: true,
				Cell: ({ row, value }: any) => (
					<Badge
						colorScheme={
							row.original.riskorreward === "Reward" ? "green" : "red"
						}
					>
						{row.original.riskorreward === "Reward" ? "+" : "-"}
						{new Intl.NumberFormat("en-US", {
							style: "currency",
							currency: "USD",
						}).format(value)}
					</Badge>
				),
			},
			{
				Header: "Fee ($)",
				accessor: "fee",
				isNumeric: true,
				Cell: ({ value }: any) =>
					new Intl.NumberFormat("en-US", {
						style: "currency",
						currency: "USD",
					}).format(value),
			},
			{
				Header: "R o R",
				accessor: "riskorreward",
				Cell: ({ value }: any) =>
					value === "Reward" ? (
						<Badge colorScheme={"green"}>Profit</Badge>
					) : (
						<Badge colorScheme={"red"}>Loss</Badge>
					),
			},

			{
				Header: "Funding rate",
				accessor: "fundingfee",
				isNumeric: true,
				Cell: ({ value }: any) =>
					new Intl.NumberFormat("en-US", {
						style: "currency",
						currency: "USD",
					}).format(value),
			},

			{
				Header: "Description",
				accessor: "description",
			},
		],
		[]
	);

	const data = React.useMemo(() => makeData(20), []);

	// Use the state and functions returned from useTable to build your UI
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page, // Instead of using 'rows', we'll use page,
		// which has only the rows for the active page

		// The rest of these things are super handy, too ;)
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		rows,
		state: { pageIndex, pageSize },
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: 2 },
		},
		// usePagination,
		useSortBy
	);

	return (
		<VStack
			spacing={4}
			alignItems="flex-start"
			my={4}
			p={[4, 8]}
			bg="white"
			boxShadow={"lg"}
			borderRadius={8}
		>
			<Table {...getTableProps()} width="120rem" size="sm" variant={"striped"}>
				<Thead>
					{headerGroups.map((headerGroup) => (
						<Tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<Th
									{...column.getHeaderProps(column.getSortByToggleProps())}
									// isNumeric={column}
								>
									{column.render("Header")}
									<chakra.span pl="4">
										{column.isSorted ? (
											column.isSortedDesc ? (
												<TriangleDownIcon aria-label="sorted descending" />
											) : (
												<TriangleUpIcon aria-label="sorted ascending" />
											)
										) : null}
									</chakra.span>
								</Th>
							))}
						</Tr>
					))}
				</Thead>
				<Tbody {...getTableBodyProps()}>
					{rows.map((row) => {
						prepareRow(row);
						return (
							<Tr {...row.getRowProps()}>
								{row.cells.map((cell) => (
									<Td
										fontSize={"sm"}
										{...cell.getCellProps()}
										isNumeric={cell.column.isNumeric}
									>
										{cell.render("Cell")}
									</Td>
								))}
							</Tr>
						);
					})}
				</Tbody>
			</Table>
		</VStack>
	);
}
