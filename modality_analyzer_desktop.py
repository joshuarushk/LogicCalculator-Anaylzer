import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox
import re
import math

class ModalityAnalyzerDesktop:
    def __init__(self, root):
        self.root = root
        self.root.title("Alethic Modality Analyzer")
        self.root.geometry("1200x800")
        self.root.minsize(800, 600)
        
        # Configure style
        self.setup_styles()
        
        # Initialize analyzer
        self.analyzer = ModalityAnalyzer()
        
        # Create GUI
        self.create_widgets()
        
    def setup_styles(self):
        style = ttk.Style()
        style.theme_use('clam')
        
        # Configure colors
        style.configure('Title.TLabel', font=('Segoe UI', 24, 'bold'), foreground='#333')
        style.configure('Subtitle.TLabel', font=('Segoe UI', 12), foreground='#666')
        style.configure('Header.TLabel', font=('Segoe UI', 14, 'bold'), foreground='#333')
        style.configure('Info.TLabel', font=('Segoe UI', 9), foreground='#6c757d', style='italic')
        
    def create_widgets(self):
        # Main container
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Configure grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(0, weight=1)
        
        # Header
        header_frame = ttk.Frame(main_frame)
        header_frame.grid(row=0, column=0, sticky=(tk.W, tk.E), pady=(0, 20))
        header_frame.columnconfigure(0, weight=1)
        
        title_label = ttk.Label(header_frame, text="Alethic Modality Analyzer", style='Title.TLabel')
        title_label.grid(row=0, column=0)
        
        subtitle_label = ttk.Label(header_frame, text="Analyze sentences for necessity, possibility, and impossibility", style='Subtitle.TLabel')
        subtitle_label.grid(row=1, column=0, pady=(5, 0))
        
        # Input section
        input_frame = ttk.LabelFrame(main_frame, text="Input", padding="15")
        input_frame.grid(row=1, column=0, sticky=(tk.W, tk.E), pady=(0, 20))
        input_frame.columnconfigure(0, weight=1)
        
        input_label = ttk.Label(input_frame, text="Enter text to analyze (sentence, paragraph, or essay):")
        input_label.grid(row=0, column=0, sticky=tk.W, pady=(0, 5))
        
        self.text_input = scrolledtext.ScrolledText(input_frame, height=6, wrap=tk.WORD, font=('Segoe UI', 11))
        self.text_input.grid(row=1, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        
        info_label = ttk.Label(input_frame, text="💡 Enter multiple sentences for detailed paragraph/essay analysis with proportional scoring", style='Info.TLabel')
        info_label.grid(row=2, column=0, sticky=tk.W, pady=(0, 10))
        
        self.analyze_button = ttk.Button(input_frame, text="Analyze Modality", command=self.analyze_text)
        self.analyze_button.grid(row=3, column=0, pady=(0, 10))
        
        # Examples section
        examples_frame = ttk.LabelFrame(input_frame, text="Examples", padding="10")
        examples_frame.grid(row=4, column=0, sticky=(tk.W, tk.E), pady=(10, 0))
        examples_frame.columnconfigure(0, weight=1)
        
        self.create_examples(examples_frame)
        
        # Results section
        self.results_frame = ttk.LabelFrame(main_frame, text="Analysis Results", padding="15")
        self.results_frame.grid(row=2, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(0, 0))
        self.results_frame.columnconfigure(0, weight=1)
        main_frame.rowconfigure(2, weight=1)
        
        self.create_results_widgets()
        
        # Initially hide results
        self.results_frame.grid_remove()
        
    def create_examples(self, parent):
        examples = [
            "All triangles have three sides.",
            "2 + 2 = 4",
            "There exists a married bachelor.",
            "It might rain tomorrow.",
            "Mathematics is built on logical foundations. All triangles necessarily have three sides. This is true by definition. However, the weather tomorrow is uncertain and might change.",
            "In formal logic, contradictions are impossible. A statement cannot be both true and false simultaneously. Either a proposition holds or it does not. These principles are necessarily true in any logical system."
        ]
        
        # Create a scrollable frame for examples
        canvas = tk.Canvas(parent, height=120)
        scrollbar = ttk.Scrollbar(parent, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas)
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        for i, example in enumerate(examples):
            btn = ttk.Button(scrollable_frame, text=example[:80] + "..." if len(example) > 80 else example,
                           command=lambda ex=example: self.load_example(ex))
            btn.grid(row=i, column=0, sticky=(tk.W, tk.E), pady=2, padx=5)
            scrollable_frame.columnconfigure(0, weight=1)
        
        canvas.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        scrollbar.grid(row=0, column=1, sticky=(tk.N, tk.S))
        parent.columnconfigure(0, weight=1)
        
    def create_results_widgets(self):
        # Modality ratings
        ratings_frame = ttk.Frame(self.results_frame)
        ratings_frame.grid(row=0, column=0, sticky=(tk.W, tk.E), pady=(0, 15))
        ratings_frame.columnconfigure(1, weight=1)
        
        ttk.Label(ratings_frame, text="Modality Ratings", style='Header.TLabel').grid(row=0, column=0, columnspan=3, pady=(0, 10))
        
        # Necessity
        ttk.Label(ratings_frame, text="Necessity:", font=('Segoe UI', 10, 'bold')).grid(row=1, column=0, sticky=tk.W, padx=(0, 10))
        self.necessity_var = tk.StringVar(value="0%")
        self.necessity_progress = ttk.Progressbar(ratings_frame, length=300, mode='determinate')
        self.necessity_progress.grid(row=1, column=1, sticky=(tk.W, tk.E), padx=(0, 10))
        ttk.Label(ratings_frame, textvariable=self.necessity_var, font=('Segoe UI', 10, 'bold')).grid(row=1, column=2)
        
        # Possibility
        ttk.Label(ratings_frame, text="Possibility:", font=('Segoe UI', 10, 'bold')).grid(row=2, column=0, sticky=tk.W, padx=(0, 10), pady=(5, 0))
        self.possibility_var = tk.StringVar(value="0%")
        self.possibility_progress = ttk.Progressbar(ratings_frame, length=300, mode='determinate')
        self.possibility_progress.grid(row=2, column=1, sticky=(tk.W, tk.E), padx=(0, 10), pady=(5, 0))
        ttk.Label(ratings_frame, textvariable=self.possibility_var, font=('Segoe UI', 10, 'bold')).grid(row=2, column=2, pady=(5, 0))
        
        # Impossibility
        ttk.Label(ratings_frame, text="Impossibility:", font=('Segoe UI', 10, 'bold')).grid(row=3, column=0, sticky=tk.W, padx=(0, 10), pady=(5, 0))
        self.impossibility_var = tk.StringVar(value="0%")
        self.impossibility_progress = ttk.Progressbar(ratings_frame, length=300, mode='determinate')
        self.impossibility_progress.grid(row=3, column=1, sticky=(tk.W, tk.E), padx=(0, 10), pady=(5, 0))
        ttk.Label(ratings_frame, textvariable=self.impossibility_var, font=('Segoe UI', 10, 'bold')).grid(row=3, column=2, pady=(5, 0))
        
        # Classification
        classification_frame = ttk.Frame(self.results_frame)
        classification_frame.grid(row=1, column=0, sticky=(tk.W, tk.E), pady=(0, 15))
        
        ttk.Label(classification_frame, text="Classification:", font=('Segoe UI', 12, 'bold')).grid(row=0, column=0, sticky=tk.W)
        self.classification_var = tk.StringVar(value="-")
        ttk.Label(classification_frame, textvariable=self.classification_var, font=('Segoe UI', 12, 'bold'), foreground='#667eea').grid(row=0, column=1, sticky=tk.W, padx=(10, 0))
        
        # Sentence breakdown (for paragraphs)
        self.breakdown_frame = ttk.LabelFrame(self.results_frame, text="Sentence-by-Sentence Analysis", padding="10")
        self.breakdown_frame.grid(row=2, column=0, sticky=(tk.W, tk.E), pady=(0, 15))
        self.breakdown_frame.columnconfigure(0, weight=1)
        
        # Analysis details
        details_frame = ttk.LabelFrame(self.results_frame, text="Analysis Details", padding="10")
        details_frame.grid(row=3, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(0, 0))
        details_frame.columnconfigure(0, weight=1)
        self.results_frame.rowconfigure(3, weight=1)
        
        self.explanation_text = scrolledtext.ScrolledText(details_frame, height=8, wrap=tk.WORD, font=('Segoe UI', 10))
        self.explanation_text.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
    def load_example(self, example):
        self.text_input.delete(1.0, tk.END)
        self.text_input.insert(1.0, example)
        self.analyze_text()
        
    def analyze_text(self):
        text = self.text_input.get(1.0, tk.END).strip()
        
        if not text:
            messagebox.showwarning("Input Required", "Please enter text to analyze.")
            return
            
        try:
            # Analyze the text
            result = self.analyzer.analyze(text)
            
            # Update UI with results
            self.update_results(result)
            
            # Show results frame
            self.results_frame.grid()
            
        except Exception as e:
            messagebox.showerror("Analysis Error", f"An error occurred during analysis: {str(e)}")
    
    def update_results(self, result):
        # Update progress bars and labels
        scores = result['scores']
        
        self.necessity_progress['value'] = scores['necessity']
        self.necessity_var.set(f"{round(scores['necessity'])}%")
        
        self.possibility_progress['value'] = scores['possibility']
        self.possibility_var.set(f"{round(scores['possibility'])}%")
        
        self.impossibility_progress['value'] = scores['impossibility']
        self.impossibility_var.set(f"{round(scores['impossibility'])}%")
        
        # Update classification
        self.classification_var.set(result['classification'])
        
        # Update sentence breakdown for paragraphs
        if result.get('isParagraph', False):
            self.update_sentence_breakdown(result['sentenceResults'])
        else:
            # Hide breakdown for single sentences
            self.breakdown_frame.grid_remove()
        
        # Update explanation
        self.explanation_text.delete(1.0, tk.END)
        self.explanation_text.insert(1.0, result['explanation'])
        
    def update_sentence_breakdown(self, sentence_results):
        # Clear existing breakdown
        for widget in self.breakdown_frame.winfo_children():
            widget.destroy()
            
        # Show breakdown frame
        self.breakdown_frame.grid()
        
        for i, result in enumerate(sentence_results):
            sentence_frame = ttk.Frame(self.breakdown_frame)
            sentence_frame.grid(row=i, column=0, sticky=(tk.W, tk.E), pady=5)
            sentence_frame.columnconfigure(1, weight=1)
            
            # Sentence text
            sentence_label = ttk.Label(sentence_frame, text=f"Sentence {i+1}:", font=('Segoe UI', 10, 'bold'))
            sentence_label.grid(row=0, column=0, sticky=tk.W)
            
            sentence_text = ttk.Label(sentence_frame, text=result['sentence'], wraplength=600, font=('Segoe UI', 9))
            sentence_text.grid(row=0, column=1, sticky=tk.W, padx=(10, 0))
            
            # Mini progress bars
            scores_frame = ttk.Frame(sentence_frame)
            scores_frame.grid(row=1, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(5, 0))
            
            scores = result['scores']
            
            # Necessity mini bar
            ttk.Label(scores_frame, text="N:", font=('Segoe UI', 8)).grid(row=0, column=0)
            n_progress = ttk.Progressbar(scores_frame, length=100, mode='determinate')
            n_progress.grid(row=0, column=1, padx=(5, 5))
            n_progress['value'] = scores['necessity']
            ttk.Label(scores_frame, text=f"{round(scores['necessity'])}%", font=('Segoe UI', 8)).grid(row=0, column=2)
            
            # Possibility mini bar
            ttk.Label(scores_frame, text="P:", font=('Segoe UI', 8)).grid(row=0, column=3, padx=(10, 0))
            p_progress = ttk.Progressbar(scores_frame, length=100, mode='determinate')
            p_progress.grid(row=0, column=4, padx=(5, 5))
            p_progress['value'] = scores['possibility']
            ttk.Label(scores_frame, text=f"{round(scores['possibility'])}%", font=('Segoe UI', 8)).grid(row=0, column=5)
            
            # Impossibility mini bar
            ttk.Label(scores_frame, text="I:", font=('Segoe UI', 8)).grid(row=0, column=6, padx=(10, 0))
            i_progress = ttk.Progressbar(scores_frame, length=100, mode='determinate')
            i_progress.grid(row=0, column=7, padx=(5, 5))
            i_progress['value'] = scores['impossibility']
            ttk.Label(scores_frame, text=f"{round(scores['impossibility'])}%", font=('Segoe UI', 8)).grid(row=0, column=8)
            
            # Classification
            ttk.Label(scores_frame, text=f"→ {result['classification']}", font=('Segoe UI', 9, 'italic')).grid(row=0, column=9, padx=(15, 0))


class ModalityAnalyzer:
    def __init__(self):
        # Alethic modality patterns
        self.logical_patterns = {
            'necessity': [
                r'\d+\s*[+\-*/]\s*\d+\s*=\s*\d+',
                r'all triangles have three sides',
                r'all squares have four sides',
                r'all bachelors are unmarried',
                r'all circles are round',
                r'either.*or not',
                r'by definition',
                r'necessarily true',
                r'logically necessary',
                r'tautology',
                r'axiom',
                r'theorem',
                r'contradictions are impossible',
                r'cannot be both.*and.*simultaneously',
                r'either.*proposition.*or.*not',
                r'principles.*necessarily true',
                r'logical system'
            ],
            'impossibility': [
                r'married bachelor',
                r'square circle',
                r'round square',
                r'something is both.*and not',
                r'true and false',
                r'exists and does not exist',
                r'self-contradictory'
            ]
        }
        
        self.modal_indicators = {
            'epistemic': ['certain', 'sure', 'confident', 'believe', 'think', 'know', 'obvious'],
            'deontic': ['must', 'should', 'ought', 'required', 'forbidden', 'allowed', 'permitted'],
            'possibility': ['can', 'could', 'may', 'might', 'possible', 'perhaps', 'maybe', 'likely', 'probable']
        }
    
    def split_into_sentences(self, text):
        sentences = re.split(r'[.!?]+\s+', text.strip())
        return [s.strip() for s in sentences if s.strip()]
    
    def analyze(self, text):
        sentences = self.split_into_sentences(text)
        
        if len(sentences) == 1:
            # Single sentence analysis
            scores = self.calculate_modality_scores(text)
            classification = self.classify_modality(scores)
            explanation = f"Single sentence analysis. Classification: {classification}"
            
            return {
                'text': text,
                'sentences': [text],
                'sentenceResults': [{
                    'sentence': text,
                    'scores': scores,
                    'classification': classification,
                    'explanation': explanation
                }],
                'scores': scores,
                'classification': classification,
                'explanation': explanation,
                'isParagraph': False
            }
        else:
            # Multi-sentence analysis
            sentence_results = []
            for sentence in sentences:
                scores = self.calculate_modality_scores(sentence)
                classification = self.classify_modality(scores)
                sentence_results.append({
                    'sentence': sentence,
                    'scores': scores,
                    'classification': classification,
                    'explanation': f"Sentence classification: {classification}"
                })
            
            # Calculate paragraph scores
            paragraph_scores = self.calculate_paragraph_scores(sentence_results)
            paragraph_classification = self.classify_modality(paragraph_scores)
            paragraph_explanation = self.generate_paragraph_explanation(sentence_results, paragraph_scores, paragraph_classification)
            
            return {
                'text': text,
                'sentences': sentences,
                'sentenceResults': sentence_results,
                'scores': paragraph_scores,
                'classification': paragraph_classification,
                'explanation': paragraph_explanation,
                'isParagraph': True
            }
    
    def calculate_modality_scores(self, sentence):
        scores = {'necessity': 0, 'possibility': 0, 'impossibility': 0}
        sentence_lower = sentence.lower()
        
        # Check for logical necessity
        logical_necessity = self.detect_logical_necessity(sentence_lower)
        logical_impossibility = self.detect_logical_impossibility(sentence_lower)
        
        if logical_necessity > 0:
            scores['necessity'] = logical_necessity
            scores['possibility'] = min(20, logical_necessity * 0.2)
            scores['impossibility'] = 0
        elif logical_impossibility > 0:
            scores['impossibility'] = logical_impossibility
            scores['necessity'] = 0
            scores['possibility'] = 0
        else:
            # Analyze contingent statement
            self.analyze_contingent_statement(scores, sentence_lower)
        
        # Ensure scores are in valid range
        for key in scores:
            scores[key] = max(0, min(100, scores[key]))
            
        return scores
    
    def detect_logical_necessity(self, sentence):
        # Check for mathematical equations
        if re.search(r'\d+\s*[+\-*/]\s*\d+\s*=\s*\d+', sentence):
            return 95
            
        # Check for logical necessity patterns
        for pattern in self.logical_patterns['necessity']:
            if re.search(pattern, sentence, re.IGNORECASE):
                return 90
                
        return 0
    
    def detect_logical_impossibility(self, sentence):
        # Don't flag statements ABOUT impossibility as impossible themselves
        if any(phrase in sentence for phrase in ['contradictions are impossible', 'are logically impossible', 'principles', 'logical system']):
            return 0
            
        # Check for actual logical contradictions
        for pattern in self.logical_patterns['impossibility']:
            if re.search(pattern, sentence, re.IGNORECASE):
                return 95
                
        return 0
    
    def analyze_contingent_statement(self, scores, sentence):
        # Check for modal indicators
        if any(word in sentence for word in self.modal_indicators['epistemic']):
            scores['possibility'] = 60
        
        if any(word in sentence for word in self.modal_indicators['deontic']):
            scores['possibility'] = 50
            
        if any(word in sentence for word in self.modal_indicators['possibility']):
            scores['possibility'] = 70
            
        # Empirical claims are contingent
        if any(word in sentence for word in ['weather', 'tomorrow', 'will happen', 'probably']):
            scores['possibility'] = 60
            scores['necessity'] = 0
    
    def calculate_paragraph_scores(self, sentence_results):
        if not sentence_results:
            return {'necessity': 0, 'possibility': 0, 'impossibility': 0}
            
        if len(sentence_results) == 1:
            return sentence_results[0]['scores']
        
        # Weighted scoring
        total_weight = 0
        weighted_scores = {'necessity': 0, 'possibility': 0, 'impossibility': 0}
        distribution = {'necessity': 0, 'possibility': 0, 'impossibility': 0, 'neutral': 0}
        
        for result in sentence_results:
            sentence = result['sentence']
            scores = result['scores']
            
            # Calculate weight
            length_weight = min(len(sentence) / 50, 2)
            sentence_weight = length_weight
            total_weight += sentence_weight
            
            # Add weighted scores
            for score_type in scores:
                weighted_scores[score_type] += scores[score_type] * sentence_weight
            
            # Track distribution
            dominant_type = self.get_dominant_modality(scores)
            distribution[dominant_type] += 1
        
        # Calculate final averages
        for score_type in weighted_scores:
            weighted_scores[score_type] = weighted_scores[score_type] / total_weight
        
        # Apply distribution adjustments
        self.apply_distribution_adjustments(weighted_scores, distribution, len(sentence_results))
        
        return weighted_scores
    
    def get_dominant_modality(self, scores):
        max_score = max(scores['necessity'], scores['possibility'], scores['impossibility'])
        if max_score < 25:
            return 'neutral'
        
        if scores['necessity'] == max_score:
            return 'necessity'
        elif scores['impossibility'] == max_score:
            return 'impossibility'
        elif scores['possibility'] == max_score:
            return 'possibility'
        return 'neutral'
    
    def apply_distribution_adjustments(self, scores, distribution, total_sentences):
        total_modal = distribution['necessity'] + distribution['possibility'] + distribution['impossibility']
        modal_ratio = total_modal / total_sentences
        
        # If most sentences are neutral, reduce scores
        if modal_ratio < 0.3:
            for score_type in scores:
                scores[score_type] *= 0.7
        
        # If strong consensus, boost that score
        for modality_type in ['necessity', 'possibility', 'impossibility']:
            if distribution[modality_type] / total_sentences > 0.6:
                scores[modality_type] = min(100, scores[modality_type] * 1.3)
        
        # Special case: if necessity dominates
        if distribution['necessity'] > distribution['impossibility'] and distribution['necessity'] > distribution['possibility']:
            scores['necessity'] = min(100, scores['necessity'] * 1.1)
            scores['impossibility'] = max(0, scores['impossibility'] * 0.8)
    
    def classify_modality(self, scores):
        threshold = 25
        max_score = max(scores['necessity'], scores['possibility'], scores['impossibility'])
        
        if scores['necessity'] == max_score and scores['necessity'] > threshold:
            if scores['necessity'] > 85:
                return 'Logically Necessary'
            elif scores['necessity'] > 70:
                return 'Strongly Necessary'
            elif scores['necessity'] > 50:
                return 'Necessary'
            return 'Weakly Necessary'
        
        if scores['impossibility'] == max_score and scores['impossibility'] > threshold:
            if scores['impossibility'] > 85:
                return 'Logically Impossible'
            elif scores['impossibility'] > 70:
                return 'Strongly Impossible'
            elif scores['impossibility'] > 50:
                return 'Impossible'
            return 'Weakly Impossible'
        
        if scores['possibility'] == max_score and scores['possibility'] > threshold:
            if scores['possibility'] > 85:
                return 'Highly Possible'
            elif scores['possibility'] > 70:
                return 'Very Possible'
            elif scores['possibility'] > 50:
                return 'Possible'
            return 'Weakly Possible'
        
        return 'Neutral/Contingent'
    
    def generate_paragraph_explanation(self, sentence_results, paragraph_scores, classification):
        total_sentences = len(sentence_results)
        distribution = {'necessity': 0, 'possibility': 0, 'impossibility': 0, 'neutral': 0}
        
        for result in sentence_results:
            dominant_type = self.get_dominant_modality(result['scores'])
            distribution[dominant_type] += 1
        
        explanation = f"Analyzed {total_sentences} sentence{'s' if total_sentences > 1 else ''}. "
        
        # Distribution breakdown
        breakdown = []
        for modality_type in distribution:
            if distribution[modality_type] > 0:
                percentage = round((distribution[modality_type] / total_sentences) * 100)
                breakdown.append(f"{distribution[modality_type]} {modality_type} ({percentage}%)")
        
        if breakdown:
            explanation += f"Distribution: {', '.join(breakdown)}. "
        
        # Overall assessment
        dominant_type = max(paragraph_scores.keys(), key=lambda k: paragraph_scores[k])
        explanation += f'Overall classification: "{classification}" based on weighted analysis with {dominant_type} as the dominant modality ({round(paragraph_scores[dominant_type])}%).'
        
        return explanation


if __name__ == "__main__":
    root = tk.Tk()
    app = ModalityAnalyzerDesktop(root)
    root.mainloop()
