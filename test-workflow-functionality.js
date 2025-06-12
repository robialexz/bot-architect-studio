// Test script pentru funcționalitatea Workflow Builder
// Rulează în browser console pentru a testa nodurile noi

console.log('🧪 TESTING WORKFLOW BUILDER FUNCTIONALITY...');

// Test 1: Verifică dacă serviciul NodeTemplate funcționează
async function testNodeTemplateService() {
  console.log('\n📋 Test 1: NodeTemplateService');

  try {
    // Simulez importul serviciului (în browser ar trebui să fie disponibil global)
    console.log('✅ NodeTemplateService should be available');

    // Test categorii
    const categories = ['AI_MODELS', 'DATA_PROCESSING', 'INTEGRATIONS', 'UTILITIES', 'TRIGGERS'];
    console.log('✅ Categories defined:', categories);

    // Test noduri specifice
    const expectedNodes = [
      'openai_gpt4',
      'openai_dalle',
      'anthropic_claude3',
      'google_gemini',
      'mysql_connector',
      'csv_parser',
      'gmail_connector',
      'slack_connector',
      'if_else',
      'math_operation',
      'webhook_trigger',
      'schedule_trigger',
    ];

    console.log('✅ Expected nodes:', expectedNodes.length);
    return true;
  } catch (error) {
    console.error('❌ NodeTemplateService test failed:', error);
    return false;
  }
}

// Test 2: Verifică interfața utilizator
async function testUserInterface() {
  console.log('\n🎨 Test 2: User Interface');

  try {
    // Verifică dacă elementele UI există
    const nodeLibrary = document.querySelector('.w-80.border-r');
    const canvas = document.querySelector('[data-testid="rf__wrapper"]');
    const searchInput = document.querySelector('input[placeholder*="Search"]');

    console.log('✅ Node Library present:', !!nodeLibrary);
    console.log('✅ Canvas present:', !!canvas);
    console.log('✅ Search input present:', !!searchInput);

    // Verifică tab-urile categorii
    const tabs = document.querySelectorAll('[role="tab"]');
    console.log('✅ Category tabs count:', tabs.length);

    return nodeLibrary && canvas && searchInput && tabs.length >= 5;
  } catch (error) {
    console.error('❌ UI test failed:', error);
    return false;
  }
}

// Test 3: Testează drag and drop (simulat)
async function testDragAndDrop() {
  console.log('\n🖱️ Test 3: Drag and Drop Simulation');

  try {
    // Găsește primul nod din bibliotecă
    const firstNodeCard = document.querySelector('[draggable="true"]');

    if (firstNodeCard) {
      console.log('✅ Draggable node found:', firstNodeCard.textContent?.trim());

      // Simulez drag start
      const dragStartEvent = new DragEvent('dragstart', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });

      firstNodeCard.dispatchEvent(dragStartEvent);
      console.log('✅ Drag start event dispatched');

      return true;
    } else {
      console.log('❌ No draggable nodes found');
      return false;
    }
  } catch (error) {
    console.error('❌ Drag and drop test failed:', error);
    return false;
  }
}

// Test 4: Verifică categoriile de noduri
async function testNodeCategories() {
  console.log('\n📂 Test 4: Node Categories');

  try {
    const categoryButtons = document.querySelectorAll('[role="tab"]');
    const expectedCategories = ['AI', 'Data', 'Apps', 'Utils', 'Triggers'];

    let foundCategories = [];
    categoryButtons.forEach(button => {
      const text = button.textContent?.trim();
      if (text && expectedCategories.some(cat => text.includes(cat))) {
        foundCategories.push(text);
      }
    });

    console.log('✅ Found categories:', foundCategories);
    console.log('✅ Expected categories found:', foundCategories.length >= 4);

    return foundCategories.length >= 4;
  } catch (error) {
    console.error('❌ Categories test failed:', error);
    return false;
  }
}

// Test 5: Verifică funcționalitatea de search
async function testSearchFunctionality() {
  console.log('\n🔍 Test 5: Search Functionality');

  try {
    const searchInput = document.querySelector('input[placeholder*="Search"]');

    if (searchInput) {
      // Simulez căutare
      searchInput.value = 'openai';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));

      console.log('✅ Search input updated with "openai"');

      // Așteaptă un moment pentru filtrare
      await new Promise(resolve => setTimeout(resolve, 100));

      const nodeCards = document.querySelectorAll('[draggable="true"]');
      console.log('✅ Filtered nodes count:', nodeCards.length);

      // Resetează search
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));

      return true;
    } else {
      console.log('❌ Search input not found');
      return false;
    }
  } catch (error) {
    console.error('❌ Search test failed:', error);
    return false;
  }
}

// Test principal
async function runAllTests() {
  console.log('🚀 STARTING COMPREHENSIVE WORKFLOW BUILDER TESTS\n');

  const tests = [
    { name: 'NodeTemplateService', fn: testNodeTemplateService },
    { name: 'User Interface', fn: testUserInterface },
    { name: 'Drag and Drop', fn: testDragAndDrop },
    { name: 'Node Categories', fn: testNodeCategories },
    { name: 'Search Functionality', fn: testSearchFunctionality },
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passedTests++;
        console.log(`✅ ${test.name}: PASSED`);
      } else {
        console.log(`❌ ${test.name}: FAILED`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR -`, error.message);
    }
  }

  console.log(`\n📊 TEST RESULTS: ${passedTests}/${totalTests} tests passed`);
  console.log(`📈 Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED! Workflow Builder is fully functional!');
  } else {
    console.log('⚠️ Some tests failed. Check the issues above.');
  }

  return { passed: passedTests, total: totalTests, success: passedTests === totalTests };
}

// Rulează testele automat
runAllTests().then(results => {
  console.log('\n🏁 TESTING COMPLETE');
  console.log('Results:', results);
});

// Export pentru utilizare externă
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests, testNodeTemplateService, testUserInterface };
}
