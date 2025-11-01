import LZString from 'lz-string';
import localForage from 'localforage';
import DBotStore from '../scratch/dbot-store';
import { save_types } from '../constants/save-type';

// Import lecture bots
import Auto102ByLegacyHub from './lecture/AUTO102BYLEGACYHUB!!.xml';
import Auto102ByLectureAdvice from './lecture/AUTO1O2BYLECTUREADVICE.xml';
import EvenOddTraderBot from './lecture/EVEN-ODDTRADERBOT.xml';
import EvenEvenOddOddBot from './lecture/EVENEVEN_ODDODDBot.xml';
import OddOddEvenEvenBot from './lecture/ODDODDEVENEVENBOT.xml';
import OverDestroyerByMikeG from './lecture/OVERDESTROYERBYMIKEG.xml';
import TheLectureSpeedbotV1 from './lecture/Thelecturespeedbotv1.xml';
import StakeList101 from './lecture/stakelist_101.xml';


// Ensure Blockly is available globally
const getBlockly = () => {
    if (typeof window !== 'undefined' && window.Blockly) {
        return window.Blockly;
    }
    throw new Error('Blockly not available - workspace not initialized');
};

// Static bot configurations - Lecture Bots Only
const STATIC_BOTS = {
    auto_102_legacy_hub: {
        id: 'auto_102_legacy_hub',
        name: 'AUTO 102 BY LEGACY HUB',
        xml: Auto102ByLegacyHub,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    auto_102_lecture_advice: {
        id: 'auto_102_lecture_advice',
        name: 'AUTO 102 BY LECTURE ADVICE',
        xml: Auto102ByLectureAdvice,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    even_odd_trader: {
        id: 'even_odd_trader',
        name: 'EVEN ODD TRADER BOT',
        xml: EvenOddTraderBot,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    even_even_odd_odd: {
        id: 'even_even_odd_odd',
        name: 'EVEN EVEN ODD ODD BOT',
        xml: EvenEvenOddOddBot,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    odd_odd_even_even: {
        id: 'odd_odd_even_even',
        name: 'ODD ODD EVEN EVEN BOT',
        xml: OddOddEvenEvenBot,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    over_destroyer_mikeg: {
        id: 'over_destroyer_mikeg',
        name: 'OVER DESTROYER BY MIKE G',
        xml: OverDestroyerByMikeG,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    the_lecture_speedbot: {
        id: 'the_lecture_speedbot',
        name: 'The Lecture Speedbot V1',
        xml: TheLectureSpeedbotV1,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    stake_list_101: {
        id: 'stake_list_101',
        name: 'Stake List 101',
        xml: StakeList101,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    }
};

const getStaticBots = () => Object.values(STATIC_BOTS);

/**
 * 🔒 Disable saving bots
 */
export const saveWorkspaceToRecent = async () => {
    console.warn('[INFO] Saving disabled → Using static bots only.');
    const {
        load_modal: { updateListStrategies },
    } = DBotStore.instance;
    updateListStrategies(getStaticBots());
};

/**
 * ✅ Always return static bots
 */
export const getSavedWorkspaces = async () => {
    const bots = getStaticBots();
    console.log(
        '[DEBUG] Available static bots:',
        bots.map(bot => bot.id)
    );
    return bots;
};

/**
 * Load a bot by ID (from static list only)
 */
export const loadStrategy = async strategy_id => {
    console.log(`[DEBUG] Attempting to load bot: ${strategy_id}`);

    const staticBots = getStaticBots();
    const strategy = staticBots.find(bot => bot.id === strategy_id);

    if (!strategy) {
        console.error(
            `[ERROR] Bot with id "${strategy_id}" not found. Available bots:`,
            staticBots.map(b => b.id)
        );
        return false;
    }

    try {
        // Get Blockly instance
        const Blockly = getBlockly();
        
        // Check if workspace is initialized
        if (!Blockly.derivWorkspace) {
            console.error('[ERROR] Blockly workspace not initialized');
            return false;
        }

        // Completely reset the workspace first
        console.log(`[DEBUG] Resetting workspace before loading bot: ${strategy_id}`);
        resetWorkspace(Blockly);

        // Parse the XML content
        const parser = new DOMParser();
        const xmlString = typeof strategy.xml === 'string' ? strategy.xml : strategy.xml.default || '';
        const xmlDom = parser.parseFromString(xmlString, 'text/xml').documentElement;

        // Check if XML is valid
        if (xmlDom.querySelector('parsererror')) {
            console.error('[ERROR] Invalid XML content for bot:', strategy_id);
            return false;
        }

        const convertedXml = convertStrategyToIsDbot(xmlDom);

        // Disable events during load to prevent interference
        Blockly.Events.disable();
        
        try {
            // Clear any existing blocks (double-check)
            Blockly.derivWorkspace.clear();
            
            // Load the new blocks
            Blockly.Xml.domToWorkspace(convertedXml, Blockly.derivWorkspace);
            
            // Store the current strategy ID
            Blockly.derivWorkspace.current_strategy_id = strategy_id;
            
            // Force a re-render
            setTimeout(() => {
                if (Blockly.derivWorkspace.svgResize) {
                    Blockly.derivWorkspace.svgResize();
                }
                Blockly.derivWorkspace.render();
            }, 100);
            
            console.log(`[SUCCESS] Loaded static bot: ${strategy.name} (ID: ${strategy_id})`);
            return true;
        } finally {
            // Always re-enable events
            Blockly.Events.enable();
        }
    } catch (error) {
        console.error('Error loading static bot:', error);
        return false;
    }
};

/**
 * 🔒 Disable removing bots
 */
export const removeExistingWorkspace = async () => {
    console.warn('[INFO] Remove disabled → Static bots only.');
    return false;
};

/**
 * Ensure xml has `is_dbot` flag
 */
export const convertStrategyToIsDbot = xml_dom => {
    if (!xml_dom) return;
    xml_dom.setAttribute('is_dbot', 'true');
    return xml_dom;
};

// 🧹 Clear storage & recents at startup
localStorage.removeItem('saved_workspaces');
localStorage.removeItem('recent_strategies');
console.log('[INFO] Cleared saved/recent bots → Static bots only.');

// 🧪 Test function to verify all bots can be parsed
export const testAllBots = () => {
    const staticBots = getStaticBots();
    console.log('[TEST] Testing all bot XML files...');
    
    staticBots.forEach(bot => {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(bot.xml, 'text/xml');
            const hasErrors = doc.getElementsByTagName('parsererror').length > 0;
            
            if (hasErrors) {
                console.error(`[TEST FAIL] ${bot.id}: XML parsing error`);
                console.error(`[TEST FAIL] XML preview:`, bot.xml.substring(0, 300) + '...');
            } else {
                console.log(`[TEST PASS] ${bot.id}: XML is valid (${bot.xml.length} chars)`);
            }
        } catch (e) {
            console.error(`[TEST FAIL] ${bot.id}: Exception during parsing:`, e.message);
        }
    });
};

// Run test on load
setTimeout(testAllBots, 1000);
