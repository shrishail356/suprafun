// import React, { useState } from 'react';
// import { processSwapTransactions } from '../utils/transactionProcessor';
// import { Search, Loader2 } from 'lucide-react';
// import { 
//   Card, 
//   CardHeader, 
//   CardTitle, 
//   CardDescription, 
//   CardContent 
// } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// // Import or define the SwapTransaction type from your transactionProcessor
// interface SwapTransaction {
//   txHash: string;
//   action: string;
//   sender: string;
//   tokenIn: {
//     symbol: string;
//     amount: number;
//   };
//   tokenOut: {
//     symbol: string;
//     amount: number;
//   };
//   txFee: number;
//   confirmationTime: string;
//   gasUnitPrice: number;
//   maxGasAmount: number;
//   expirationTime: string;
//   blockHash: string;
//   blockHeight: number;
//   vmStatus: string;
// }

// const SwapTransactionsViewer: React.FC = () => {
//   const [address, setAddress] = useState<string>('');
//   const [swaps, setSwaps] = useState<SwapTransaction[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');

  // const fetchTransactions = async (): Promise<void> => {
  //   if (!address) {
  //     setError('Please enter an address');
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     setError('');
  //     const response = await fetch(
  //       `https://rpc-testnet.supra.com/rpc/v1/accounts/${address}/transactions`
  //     );
  //     const data = await response.json();
  //     const processedSwaps = processSwapTransactions(data);
  //     setSwaps(processedSwaps);
  //     if (processedSwaps.length === 0) {
  //       setError('No swap transactions found for this address');
  //     }
  //   } catch (err) {
  //     setError('Error fetching transactions. Please check the address and try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSubmit = (e: React.FormEvent): void => {
  //   e.preventDefault();
  //   fetchTransactions();
  // };

//   return (
//     <Card className="w-full max-w-6xl mx-auto mt-8">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold">Swap Transactions Explorer</CardTitle>
//         <CardDescription>Enter an address to view swap transactions</CardDescription>
//       </CardHeader>
//       <CardContent>
        // <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
        //   <div className="relative flex-1">
        //     <Input
        //       type="text"
        //       placeholder="Enter address (0x...)"
        //       value={address}
        //       onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
        //       className="pl-10"
        //     />
        //     <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        //   </div>
        //   <Button type="submit" disabled={loading}>
        //     {loading ? (
        //       <Loader2 className="h-4 w-4 animate-spin mr-2" />
        //     ) : (
        //       'Search'
        //     )}
        //   </Button>
        // </form>

//         {error && (
//           <div className="text-red-500 mb-4">{error}</div>
//         )}

//         {swaps.length > 0 && (
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Transaction Hash</TableHead>
//                   <TableHead>Token Swap</TableHead>
//                   <TableHead>Block Height</TableHead>
//                   <TableHead>Time</TableHead>
//                   <TableHead>Status</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {swaps.map((swap: SwapTransaction) => (
//                   <TableRow key={swap.txHash}>
//                     <TableCell className="font-mono">
//                       {`${swap.txHash.slice(0, 6)}...${swap.txHash.slice(-4)}`}
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex flex-col">
//                         <span className="text-green-600">
//                           +{swap.tokenOut.amount} {swap.tokenOut.symbol}
//                         </span>
//                         <span className="text-red-600">
//                           -{swap.tokenIn.amount} {swap.tokenIn.symbol}
//                         </span>
//                       </div>
//                     </TableCell>
//                     <TableCell>{swap.blockHeight}</TableCell>
//                     <TableCell>
//                       <div className="flex flex-col">
//                         <span>{new Date(swap.confirmationTime).toLocaleDateString()}</span>
//                         <span className="text-sm text-gray-500">
//                           {new Date(swap.confirmationTime).toLocaleTimeString()}
//                         </span>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         swap.vmStatus === "Executed successfully"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       }`}>
//                         {swap.vmStatus === "Executed successfully" ? "Success" : "Failed"}
//                       </span>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default SwapTransactionsViewer;


import React, { useState } from 'react';
import { processSwapTransactions } from '../utils/transactionProcessor';
import { Search, Loader2, Copy, Check } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SwapTransaction {
  txHash: string;
  action: string;
  sender: string;
  tokenIn: {
    symbol: string;
    amount: number;
  };
  tokenOut: {
    symbol: string;
    amount: number;
  };
  txFee: number;
  confirmationTime: string;
  gasUnitPrice: number;
  maxGasAmount: number;
  expirationTime: string;
  blockHash: string;
  blockHeight: number;
  vmStatus: string;
}

const SwapTransactionsViewer: React.FC = () => {
  const [address, setAddress] = useState<string>('');
  const [swaps, setSwaps] = useState<SwapTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState<string>('');

  const handleCopyHash = async (hash: string) => {
    await navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(''), 2000);
  };

  const fetchTransactions = async (): Promise<void> => {
    if (!address) {
      setError('Please enter an address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await fetch(
        `https://rpc-testnet.supra.com/rpc/v1/accounts/${address}/transactions`
      );
      const data = await response.json();
      const processedSwaps = processSwapTransactions(data);
      console.log("This is the processed swaps : ", processedSwaps);
      setSwaps(processedSwaps);
      if (processedSwaps.length === 0) {
        setError('No swap transactions found for this address');
      }
    } catch (err) {
      setError('Error fetching transactions. Please check the address and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    fetchTransactions();
  };

  // Rest of the fetch and submit handlers remain the same...

  return (
    <Card className="w-full max-w-7xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Swap Transactions Explorer</CardTitle>
        <CardDescription>Enter an address to view swap transactions</CardDescription>
      </CardHeader>
      <CardContent>
      <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Enter address (0x...)"
              value={address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              'Search'
            )}
          </Button>
        </form>

        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

        {swaps.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-14">Sl No.</TableHead>
                  <TableHead>Transaction Hash</TableHead>
                  <TableHead>Token Swap</TableHead>
                  <TableHead>Gas & Fees</TableHead>
                  <TableHead>Block Info</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {swaps.map((swap: SwapTransaction, index: number) => (
                  <TableRow key={swap.txHash}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    
                    <TableCell className="font-mono">
                      <div className="flex items-center gap-2">
                        <span>{`${swap.txHash.slice(0, 6)}...${swap.txHash.slice(-4)}`}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => handleCopyHash(swap.txHash)}
                              >
                                {copiedHash === swap.txHash ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {copiedHash === swap.txHash ? 'Copied!' : 'Copy hash'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-green-600">
                          +{swap.tokenOut.amount.toFixed(6)} {swap.tokenOut.symbol}
                        </span>
                        <span className="text-red-600">
                          -{swap.tokenIn.amount.toFixed(6)} {swap.tokenIn.symbol}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <span>Fee: {swap.txFee.toFixed(6)} SUPRA</span>
                        <span>Gas Price: {swap.gasUnitPrice}</span>
                        <span>Max Gas: {swap.maxGasAmount}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <span>Height: {swap.blockHeight}</span>
                        <span className="font-mono text-xs">
                          {`${swap.blockHash.slice(0, 6)}...${swap.blockHash.slice(-4)}`}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span>{new Date(swap.confirmationTime).toLocaleDateString()}</span>
                        <span className="text-gray-500">
                          {new Date(swap.confirmationTime).toLocaleTimeString()}
                        </span>
                        <span className="text-xs text-gray-400">
                          Expires: {new Date(swap.expirationTime).toLocaleTimeString()}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        swap.vmStatus === "Executed successfully"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {swap.vmStatus === "Executed successfully" ? "Success" : "Failed"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SwapTransactionsViewer;