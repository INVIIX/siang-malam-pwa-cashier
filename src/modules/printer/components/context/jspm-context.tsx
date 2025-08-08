"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useLocalStorage } from 'react-use';

type JSPMContextType = {
    JSPM: any | null;
    printers: any | null;
    selectedPrinter: any;
    changePrinter: (data: string) => void;
    printCommand: (data: number[]) => void;
    isReady: boolean
};

const JSPMContext = createContext<JSPMContextType>({
    JSPM: null,
    printers: null,
    selectedPrinter: null,
    changePrinter: () => { },
    printCommand: () => { },
    isReady: false
});

export const JSPMProvider = ({ children }: { children: ReactNode }) => {
    const JSPM = window.JSPM;
    const [isReady, setIsReady] = useState<boolean>(false);

    const [printers, setPrinters] = useLocalStorage<any>('availablePrinter', []);
    const [selectedPrinter, setSelectedPrinter] = useLocalStorage<any>('selectedPrinter', null);

    const [clientPrinter, setClientPrinter] = useState<any>('clientPrinter');
    const [clientPrinterJob, setClientPrinterJob] = useState<any>(null);

    const printCommand = (data: number[]) => {
        clientPrinterJob.binaryPrinterCommands = data;
        clientPrinterJob.sendToClient();
    }

    const changePrinter = (printerName: string) => {
        if (printers && printers.length > 0) {
            const filterPrinters = printers?.filter((printer: any) => printer.name === printerName);
            const defaultPrinters = printers?.filter((printer: any) => printer.default);
            const foundedClientPrinter = filterPrinters.length > 0 ? filterPrinters[0] : defaultPrinters[0];
            const printer = new JSPM.InstalledPrinter(foundedClientPrinter.name);
            if (printer != null && clientPrinterJob != null) {
                clientPrinterJob.clientPrinter = printer;
                setClientPrinter(foundedClientPrinter)
                setIsReady(true)
            }
        }
    }

    useEffect(() => {
        changePrinter(selectedPrinter ?? '')
    }, [printers])

    useEffect(() => {
        setSelectedPrinter(clientPrinter.name)
    }, [clientPrinter])

    useEffect(() => {
        JSPM.JSPrintManager.auto_reconnect = true;
        JSPM.JSPrintManager.start();

        JSPM.JSPrintManager.WS.onOpen = function () {
            console.log('JSPM WS Open');
        }

        JSPM.JSPrintManager.WS.onClose = function () {
            console.log('JSPM WS Close');
        }

        JSPM.JSPrintManager.WS.onStatusChanged = function () {
            if (JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Open) {
                console.log('JSPM is running');
                const cpj = new JSPM.ClientPrintJob();
                setClientPrinterJob(cpj);
                JSPM.JSPrintManager.getPrintersInfo().then(function (printersList: any) {
                    setPrinters(printersList)
                });
            }
            else if (JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Closed) {
                console.log('JSPM is not installed or not running!');
            }
            else if (JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Blocked) {
                console.log('JSPM has blocked this website!');
            }
        }
    }, []);

    return (
        <JSPMContext.Provider value={{ JSPM, printers, selectedPrinter, changePrinter, printCommand, isReady }}>
            {children}
        </JSPMContext.Provider>
    );
};

// Custom hook
export const useJSPM = () => useContext(JSPMContext);
