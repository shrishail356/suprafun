import React, { useState } from 'react';
import { processSwapTransactions, processLiquidityTransactions, processAllTransactions, processTokenTransferTransactions, processMintTransactions } from './utils/transactionProcessor';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types from your transaction processor
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

interface LiquidityTransaction {
  txHash: string;
  action: string;
  sender: string;
  tokensAdded: {
    symbol: string;
    amount: number;
  }[];
  lpTokenReceived: {
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


interface TokenTransferTransaction {
  txHash: string;
  action: string;
  sender: string;
  receiver: string;
  transfer: {
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

interface MintTransaction {
  txHash: string;
  action: string;
  sender: string;
  receiver: string;
  mint: {
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

interface CombinedTransaction extends Omit<SwapTransaction & LiquidityTransaction & TokenTransferTransaction & MintTransaction, 'action'> {
  type: 'swap' | 'liquidity' | 'transfer' | 'mint';
  action: string;
}


type TransactionType = 'all' | 'swap' | 'liquidity' | 'transfer' | 'mint';

const TransactionViewer: React.FC = () => {
  const [address, setAddress] = useState<string>('');
  const [transactions, setTransactions] = useState<CombinedTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState<string>('');
  const [transactionType, setTransactionType] = useState<TransactionType>('all');
  
  // New state for pagination and count
  const [count, setCount] = useState<number>(20);
  const [startSequence, setStartSequence] = useState<string>('');

  const handleCopyHash = async (hash: string) => {
    await navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(''), 2000);
  };

  // const fetchTransactions = async (): Promise<void> => {
  //   if (!address) {
  //     setError('Please enter an address');
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     setError('');

  //     let url = `https://rpc-testnet.supra.com/rpc/v1/accounts/${address}/coin_transactions?count=${count}`;
  //     if (startSequence) {
  //       url += `&start=${startSequence}`;
  //     }

  //     const response = await fetch(url);
  //     const data = await response.json();
      
  //     let processedTransactions;
  //     switch (transactionType) {
  //       case 'swap':
  //         processedTransactions = processSwapTransactions(data).map(tx => ({ ...tx, type: 'swap' as const }));
  //         break;
  //       case 'liquidity':
  //         processedTransactions = processLiquidityTransactions(data).map(tx => ({ ...tx, type: 'liquidity' as const }));
  //         break;
  //       case 'transfer':
  //         processedTransactions = processTokenTransferTransactions(data).map(tx => ({ ...tx, type: 'transfer' as const }));
  //         break;
  //       case 'mint':
  //         processedTransactions = processMintTransactions(data).map(tx => ({ ...tx, type: 'mint' as const }));
  //         break;
  //       default:
  //         processedTransactions = processAllTransactions(data);
  //     }

  //     setTransactions(processedTransactions as CombinedTransaction[]);
  //     if (processedTransactions.length === 0) {
  //       setError(`No ${transactionType} transactions found for this address`);
  //     }
  //   } catch (err) {
  //     setError('Error fetching transactions. Please check the address and try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  const fetchTransactions = async (): Promise<void> => {
    if (!address) {
      setError('Please enter an address');
      console.error('Error: Address field is empty');
      return;
    }
  
    try {
      setLoading(true);
      setError('');
      
      let url = `https://rpc-testnet.supra.com/rpc/v1/accounts/${address}/coin_transactions?count=${count}`;
      if (startSequence) {
        url += `&start=${startSequence}`;
      }
  
      console.log('Fetching transactions from URL:', url);
      
      const response = await fetch(url);
      console.log('Response Status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Raw API Response:', data);
      
      let processedTransactions;
      switch (transactionType) {
        case 'swap':
          processedTransactions = processSwapTransactions(data).map(tx => ({ ...tx, type: 'swap' as const }));
          break;
        case 'liquidity':
          processedTransactions = processLiquidityTransactions(data).map(tx => ({ ...tx, type: 'liquidity' as const }));
          break;
        case 'transfer':
          processedTransactions = processTokenTransferTransactions(data).map(tx => ({ ...tx, type: 'transfer' as const }));
          break;
        case 'mint':
          processedTransactions = processMintTransactions(data).map(tx => ({ ...tx, type: 'mint' as const }));
          break;
        default:
          processedTransactions = processAllTransactions(data);
      }
  
      console.log('Processed Transactions:', processedTransactions);
  
      setTransactions(processedTransactions as CombinedTransaction[]);
      
      if (processedTransactions.length === 0) {
        setError(`No ${transactionType} transactions found for this address`);
        console.warn(`No ${transactionType} transactions found`);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Error fetching transactions. Please check the address and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    fetchTransactions();
  };

  const renderTransactionDetails = (transaction: CombinedTransaction) => {
    if (transaction.type === 'swap') {
      return (
        <div className="flex flex-col gap-1">
          <span className="text-green-600">
            +{transaction.tokenOut.amount.toFixed(6)} {transaction.tokenOut.symbol}
          </span>
          <span className="text-red-600">
            -{transaction.tokenIn.amount.toFixed(6)} {transaction.tokenIn.symbol}
          </span>
        </div>
      );
    }
    else if (transaction.type === 'transfer') {
      return (
        <div className="flex flex-col gap-1">
          <span className="text-orange-600">
            {transaction.transfer.amount.toFixed(6)} {transaction.transfer.symbol}
          </span>
          <span className="text-xs text-gray-500">
            To: {`${transaction.receiver.slice(0, 6)}...${transaction.receiver.slice(-4)}`}
          </span>
        </div>
      );
    }
    else if (transaction.type === 'mint') {
      return (
        <div className="flex flex-col gap-1">
          <span className="text-purple-600">
            Minted {transaction.mint.amount.toFixed(6)} {transaction.mint.symbol}
          </span>
          <span className="text-xs text-gray-500">
            To: {`${transaction.receiver.slice(0, 6)}...${transaction.receiver.slice(-4)}`}
          </span>
        </div>
      );
    }
    else {
      return (
        <div className="flex flex-col gap-1">
          {transaction.tokensAdded.map((token, index) => (
            <span key={index} className="text-red-600">
              -{token.amount.toFixed(6)} {token.symbol}
            </span>
          ))}
          <span className="text-green-600">
            +{transaction.lpTokenReceived.amount.toFixed(6)} {transaction.lpTokenReceived.symbol}
          </span>
        </div>
      );
    }
  };
  
  return (
    <Card className="w-full max-w-7xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Transaction Explorer</CardTitle>
        <CardDescription>View swap and liquidity transactions</CardDescription>
      </CardHeader>
      <CardContent>
      <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Enter address (0x...)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <Select
              value={transactionType}
              onValueChange={(value: TransactionType) => setTransactionType(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="swap">Swap Only</SelectItem>
                <SelectItem value="liquidity">Liquidity Only</SelectItem>
                <SelectItem value="transfer">Transfer Only</SelectItem>
                <SelectItem value="mint">Mint Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <div className="w-[180px]">
              <Select
                value={count.toString()}
                onValueChange={(value) => setCount(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20 transactions</SelectItem>
                  <SelectItem value="50">50 transactions</SelectItem>
                  <SelectItem value="100">100 transactions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Starting sequence number (optional)"
                value={startSequence}
                onChange={(e) => setStartSequence(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                'Search'
              )}
            </Button>
          </div>
        </form>
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

        {transactions.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-14">Sl No.</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Transaction Hash</TableHead>
                  <TableHead>Token Details</TableHead>
                  <TableHead>Gas & Fees</TableHead>
                  <TableHead>Block Info</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx, index) => (
                  <TableRow key={tx.txHash}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tx.type === 'swap'
                        ? "bg-blue-100 text-blue-800"
                        : tx.type === 'liquidity'
                        ? "bg-purple-100 text-purple-800"
                        : tx.type === 'transfer'
                        ? "bg-orange-100 text-orange-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {tx.type === 'swap' ? 'Swap' : tx.type === 'liquidity' ? 'Liquidity' : tx.type === 'transfer' ? 'Transfer' : 'Mint'}
                    </span>
                    </TableCell>
                    <TableCell className="font-mono">
                      <div className="flex items-center gap-2">
                        <span>{`${tx.txHash.slice(0, 6)}...${tx.txHash.slice(-4)}`}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => handleCopyHash(tx.txHash)}
                              >
                                {copiedHash === tx.txHash ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {copiedHash === tx.txHash ? 'Copied!' : 'Copy hash'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    
                    <TableCell>{renderTransactionDetails(tx)}</TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <span>Fee: {tx.txFee.toFixed(6)} SUPRA</span>
                        <span>Gas Price: {tx.gasUnitPrice}</span>
                        <span>Max Gas: {tx.maxGasAmount}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <span>Height: {tx.blockHeight}</span>
                        <span className="font-mono text-xs">
                          {`${tx.blockHash.slice(0, 6)}...${tx.blockHash.slice(-4)}`}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span>{new Date(tx.confirmationTime).toLocaleDateString()}</span>
                        <span className="text-gray-500">
                          {new Date(tx.confirmationTime).toLocaleTimeString()}
                        </span>
                        <span className="text-xs text-gray-400">
                          Expires: {new Date(tx.expirationTime).toLocaleTimeString()}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        tx.vmStatus === "Executed successfully"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {tx.vmStatus === "Executed successfully" ? "Success" : "Failed"}
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

export default TransactionViewer;