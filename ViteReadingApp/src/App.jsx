import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Reading from './pages/Reading';
import HomeReading from './pages/HomeReading';

function App() {
  return (
    <SidebarProvider>
       <div className="flex w-full min-h-screen overflow-hidden">
      <AppSidebar />
      <main  className="flex-1 overflow-auto overflow-hidden">
        <SidebarTrigger />
        <Router>
          <Routes>
            <Route path="/reading" element={<Reading />} />
            <Route path='/home-reading' element={<HomeReading />} />
          </Routes>
        </Router>
      </main>
      </div>
    </SidebarProvider>
  );
}

export default App;
