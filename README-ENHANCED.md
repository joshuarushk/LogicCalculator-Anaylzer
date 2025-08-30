# Enhanced Modality Analyzer & Logical Calculator

A comprehensive Windows desktop application that combines **Alethic Modality Analysis** with an **Advanced Logical Calculator**, built with Electron for a native desktop experience.

## 🚀 Features

### 🔍 Modality Analyzer
- **Text Analysis**: Analyze sentences, paragraphs, and essays for alethic modality
- **Proportional Scoring**: Detailed scoring for necessity, possibility, and impossibility
- **Sentence Breakdown**: Individual analysis for each sentence in longer texts
- **Grammatical Analysis**: Token identification and modal indicator detection
- **Natural Language Processing**: Advanced NLP capabilities for text understanding

### 🧮 Logical Calculator
- **Multiple Logic Systems**: Classical, Intuitionistic, Modal, and Predicate Logic
- **Complete Logical Connectives**: All standard logical operators (¬, ∧, ∨, →, ↔, ⊕, ⊤, ⊥)
- **Quantifiers**: Universal (∀), Existential (∃), and Unique (∃!) quantifiers
- **Modal Operators**: Necessity (□) and Possibility (◇) operators
- **Truth Table Generation**: Complete truth tables with analysis
- **Proof Generation**: Step-by-step proof construction for different logic types
- **Semantic Analysis**: Deep logical property analysis and interpretation
- **Logical Templates**: Pre-built common logical forms and argument patterns

## 🎯 Use Cases

### For Students & Educators
- **Logic Classes**: Practice logical reasoning and proof construction
- **Philosophy Courses**: Analyze modal logic and alethic modality
- **Mathematics**: Understand logical foundations and proof techniques
- **Computer Science**: Study formal logic and computational reasoning

### For Researchers & Professionals
- **Academic Research**: Analyze complex logical arguments and proofs
- **Philosophical Analysis**: Study different logical systems and their properties
- **Legal Reasoning**: Apply logical analysis to legal arguments
- **AI Development**: Understand logical foundations for artificial intelligence

## 🛠️ Installation & Setup

### Prerequisites
- Windows 10 or later
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Quick Start
1. **Download** the application files
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Launch Application**:
   ```bash
   npm start
   ```
4. **Alternative Launch**: Double-click `launch.bat`

### Building Executable
```bash
npm run build-win
```
This creates a standalone Windows executable in the `dist` folder.

## 📱 Application Interface

### Tab-Based Navigation
- **Modality Analyzer Tab**: Original text analysis functionality
- **Logical Calculator Tab**: Advanced logical reasoning tools

### Logical Calculator Interface
1. **Logic Type Selector**: Choose between Classical, Intuitionistic, Modal, or Predicate logic
2. **Variable Management**: Add and manage logical variables
3. **Connective Buttons**: Click to insert logical operators
4. **Expression Builder**: Build complex logical expressions
5. **Results Tabs**: View evaluation, truth tables, proof steps, and semantic analysis

## 🔧 How to Use the Logical Calculator

### 1. Choose Logic Type
- **Classical Logic**: Standard propositional logic with bivalence
- **Intuitionistic Logic**: Constructive logic without excluded middle
- **Modal Logic**: Logic with necessity and possibility operators
- **Predicate Logic**: First-order logic with quantifiers

### 2. Add Variables
- Enter variable names (e.g., `p, q, r, A, B, C`)
- Use Greek letters for mathematical variables (α, β, γ)
- Variables are automatically detected in expressions

### 3. Build Expressions
- Use connective buttons to insert operators
- Add parentheses for proper grouping
- Examples:
  - `(p ∧ q) → (r ∨ ¬s)` - Classical implication
  - `∀x(P(x) → Q(x))` - Universal quantification
  - `□(p → q) ∧ ◇p → ◇q` - Modal logic

### 4. Evaluate and Analyze
- **Evaluate Expression**: Check logical validity
- **Generate Truth Table**: See all possible truth combinations
- **View Proof Steps**: Step-by-step logical reasoning
- **Semantic Analysis**: Deep logical property analysis

### 5. Use Templates
Pre-built logical forms include:
- **Modus Ponens**: `(p → q) ∧ p → q`
- **Modus Tollens**: `(p → q) ∧ ¬q → ¬p`
- **De Morgan's Laws**: `¬(p ∧ q) ↔ (¬p ∨ ¬q)`
- **Contraposition**: `(p → q) ↔ (¬q → ¬p)`

## 🎨 Features in Detail

### Truth Table Generation
- **Automatic Generation**: Creates complete truth tables for any expression
- **Visual Analysis**: Color-coded true/false values
- **Property Detection**: Identifies tautologies, contradictions, and contingencies
- **Row Analysis**: Counts and categorizes different logical outcomes

### Proof Generation
- **Logic-Specific Proofs**: Different proof strategies for each logic type
- **Step-by-Step**: Clear progression from premises to conclusion
- **Rule Application**: Shows which logical rules are applied
- **Justification**: Explains each step of the proof

### Semantic Analysis
- **Logical Properties**: Identifies tautologies, contradictions, satisfiability
- **System Interpretation**: Explains meaning in different logical systems
- **Equivalence Analysis**: Shows logical equivalences and transformations
- **Validity Assessment**: Determines if expressions are logically valid

## 🔬 Supported Logical Systems

### Classical Logic
- **Principles**: Bivalence, excluded middle, double negation
- **Connectives**: All standard propositional operators
- **Semantics**: Truth-functional interpretation
- **Applications**: Standard mathematical and philosophical reasoning

### Intuitionistic Logic
- **Principles**: Constructive proof, no excluded middle
- **Connectives**: Same as classical, different interpretation
- **Semantics**: Constructive interpretation
- **Applications**: Constructive mathematics, computer science

### Modal Logic
- **Principles**: Necessity and possibility operators
- **Connectives**: Standard operators plus □ and ◇
- **Semantics**: Possible worlds interpretation
- **Applications**: Epistemology, metaphysics, AI reasoning

### Predicate Logic
- **Principles**: Quantification over variables and predicates
- **Connectives**: Propositional operators plus quantifiers
- **Semantics**: Domain interpretation
- **Applications**: Mathematical logic, formal semantics

## 🎯 Advanced Features

### Variable Management
- **Flexible Naming**: Support for Latin, Greek, and mathematical symbols
- **Automatic Detection**: Variables found in expressions are automatically added
- **Validation**: Ensures proper variable naming conventions

### Expression Building
- **Smart Insertion**: Automatic spacing around logical operators
- **Parentheses Management**: Easy addition and management of grouping
- **Template System**: Quick access to common logical forms
- **Syntax Highlighting**: Visual feedback for expression structure

### Result Analysis
- **Multiple Views**: Different perspectives on the same logical expression
- **Interactive Tables**: Scrollable truth tables for complex expressions
- **Export Ready**: Results can be copied for use in documents
- **Error Handling**: Graceful handling of invalid expressions

## 🚀 Performance & Scalability

### Optimization
- **Efficient Algorithms**: Fast truth table generation even for complex expressions
- **Memory Management**: Optimized for large logical expressions
- **Responsive UI**: Smooth interaction even with complex calculations

### Limitations
- **Variable Count**: Practical limit of ~20 variables for truth tables
- **Expression Complexity**: Very complex nested expressions may take longer to process
- **Memory Usage**: Large truth tables consume more memory

## 🔧 Technical Implementation

### Architecture
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Electron (Chromium + Node.js)
- **Logic Engine**: Custom logical reasoning algorithms
- **UI Framework**: Responsive design with modern CSS

### Key Components
- **LogicalCalculator Class**: Core logical reasoning engine
- **Expression Parser**: Parses and validates logical expressions
- **Truth Table Generator**: Creates complete truth tables
- **Proof Generator**: Generates proof steps for different logic types
- **Semantic Analyzer**: Analyzes logical properties and meaning

### Extensibility
- **Modular Design**: Easy to add new logic systems
- **Plugin Architecture**: Support for custom logical operators
- **API Ready**: Can be extended with additional functionality

## 📚 Educational Resources

### Learning Paths
1. **Beginner**: Start with classical logic and simple expressions
2. **Intermediate**: Explore truth tables and proof generation
3. **Advanced**: Study modal and predicate logic
4. **Expert**: Analyze complex logical systems and their properties

### Common Patterns
- **Logical Fallacies**: Identify and avoid common reasoning errors
- **Proof Techniques**: Learn different methods of logical proof
- **System Comparison**: Understand differences between logical systems
- **Applications**: See how logic applies to real-world problems

## 🐛 Troubleshooting

### Common Issues
1. **Expression Won't Parse**: Check syntax and parentheses
2. **Truth Table Too Large**: Reduce number of variables
3. **Slow Performance**: Complex expressions may take time
4. **Display Issues**: Check browser compatibility

### Getting Help
- **Error Messages**: Read error descriptions carefully
- **Examples**: Use built-in templates as starting points
- **Documentation**: Refer to this README for guidance
- **Community**: Check for updates and community support

## 🔮 Future Enhancements

### Planned Features
- **Natural Language Input**: Type logical expressions in plain English
- **Visual Proof Builder**: Drag-and-drop proof construction
- **Advanced Logic Systems**: Support for more specialized logics
- **Export Formats**: PDF, LaTeX, and other document formats
- **Collaboration Tools**: Share and collaborate on logical proofs

### Integration Possibilities
- **Mathematical Software**: Integration with Mathematica, Maple
- **Educational Platforms**: LMS integration for classroom use
- **Research Tools**: Integration with academic databases
- **AI Systems**: Interface with logical reasoning AI

## 📄 License & Attribution

- **License**: MIT License
- **Contributors**: Open to community contributions
- **Acknowledgments**: Built on established logical foundations
- **Citations**: Please cite if used in academic work

## 🤝 Contributing

We welcome contributions! Areas for improvement include:
- **New Logic Systems**: Additional logical frameworks
- **UI Enhancements**: Better user experience
- **Performance**: Faster algorithms and better optimization
- **Documentation**: Improved guides and examples
- **Testing**: More comprehensive test coverage

## 📞 Support & Contact

- **Issues**: Report bugs and request features
- **Documentation**: Comprehensive guides and examples
- **Community**: Join discussions and share knowledge
- **Updates**: Stay informed about new features

---

**Transform your logical reasoning with the most advanced desktop logical calculator available!** 🚀🧮✨
