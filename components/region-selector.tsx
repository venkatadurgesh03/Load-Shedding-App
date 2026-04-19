"use client";

import { motion } from "framer-motion";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export function RegionSelector() {
  const { regions, selectedRegion, setSelectedRegion } = useApp();

  const currentRegion = selectedRegion
    ? regions.find((r) => r.id === selectedRegion)
    : null;

  const groupedRegions = regions.reduce((acc, region) => {
    if (!acc[region.zone]) {
      acc[region.zone] = [];
    }
    acc[region.zone].push(region);
    return acc;
  }, {} as Record<string, typeof regions>);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full sm:w-auto justify-between glass border-primary/30 hover:border-primary/50 hover:glow-cyan transition-all"
        >
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-primary" />
            <span className="truncate max-w-[150px]">
              {currentRegion ? currentRegion.name : "All Regions"}
            </span>
          </div>
          <ChevronDownIcon className="w-4 h-4 ml-2 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 glass-strong">
        <DropdownMenuItem
          onClick={() => setSelectedRegion(null)}
          className={!selectedRegion ? "bg-primary/10" : ""}
        >
          <GlobeIcon className="w-4 h-4 mr-2 text-primary" />
          All Regions
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {Object.entries(groupedRegions).map(([zone, zoneRegions]) => (
          <div key={zone}>
            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
              {zone}
            </DropdownMenuLabel>
            {zoneRegions.map((region) => (
              <DropdownMenuItem
                key={region.id}
                onClick={() => setSelectedRegion(region.id)}
                className={selectedRegion === region.id ? "bg-primary/10" : ""}
              >
                <motion.div
                  className="flex items-center justify-between w-full"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>{region.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    region.stage >= 5 ? "bg-destructive/20 text-destructive" :
                    region.stage >= 3 ? "bg-accent/20 text-accent" :
                    "bg-success/20 text-success"
                  }`}>
                    Stage {region.stage}
                  </span>
                </motion.div>
              </DropdownMenuItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
