// TODO don't forget to change the package declaration in the line underneath and delete this comment!!!
package edu.rutgers.elearning.component.pte;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

import edu.rutgers.elearning.util.math.SigfigNumber;
import edu.rutgers.elearning.component.pte.ProblemTemplateEngine;
import edu.rutgers.elearning.component.questions.DecimalQuestion;
import edu.rutgers.elearning.component.questions.GeneratedQuestion;
import edu.rutgers.elearning.component.questions.MultipleChoiceQuestion;
import edu.rutgers.elearning.component.questions.QuestionAnswer;

/**
 * PTE ID: 420
 * PTE Name: something
 * 
 * @author arjun
 */
public class Template extends ProblemTemplateEngine {
	
	float a;
	double b;
	int c;

	ArrayList<String> distractors = new ArrayList<String>();
	Random rand = new Random();
	SigfigNumber answer;
	
	/**
	 * Constructor for the Template class - to be completed
	 * in each individual problem template
	 * 
	 * @param problemtemplate_id - The ID number from the 
	 * 		  problemtemplates database
	 * @param criticalskill_ids - ID for which critical 
	 * 		  skills are being used in this problem template
	 * @param debugmode - denotes whether question should be generated for actual use or debugging purposes
	 * @param type - either multiple choice or open answer
	 */
	public Template(int problemtemplate_id, int[] criticalskill_ids,
			int debugmode, QuestionType type) {
		super(problemtemplate_id, criticalskill_ids, debugmode, type);
		// TODO Auto-generated constructor stub
		
	}
	
	/**
	 * Formats the answers from a SigfigNumber into a 
	 * QuestionAnswer object. Answers passed to this method 
	 * can either be correct or incorrect answers.
	 * 
	 * @param answer - The answer to be displayed
	 * @param correct - true if this is the correct answer, otherwise false
	 * @return QuestionAnswer - Answer to be displayed to the user as one 
	 * 		   of the multiple choice options
	 */
	protected QuestionAnswer formatAnswer(SigfigNumber answer, boolean correct, int distractorId) {
		QuestionAnswer qa = null;
		distractors.add(answer.toStringMaybeSciNotation());
		qa = new QuestionAnswer(answer.toString(), answer.toStringMaybeSciNotation(), correct, distractorId);
		
		return qa;
	}
	
	/**
	 * Populates the multiple choice answers, typically
	 * one correct answer and four incorrect answers. If
	 * five answers are not defined, this method will generate
	 * answers similar to the correct answer.
	 * 
	 * @return List&lt;QuestionAnswer&gt; - the answers to be displayed
	 * 		   to the users.
	 */
	public List<QuestionAnswer> getMultipleChoiceAnswers() {
		List<QuestionAnswer> answers = new ArrayList<QuestionAnswer>();

		answers.add(formatAnswer(answer, true, 0));
		/*List<SigfigNumber> values = new ArrayList<SigfigNumber>(answer_count);
		values.add(answer);
		
		int exponent = answer.getExponentDecimal();
		int sigfigs = answer.getSignificantDigitsRounded();
		double min_diff = Math.pow(10,-answer.getDecimalDigitsRounded());
		if (sigfigs > 1) min_diff *= 3;
		while (answers.size() < answer_count) {
			Boolean good = true;
			SigfigNumber value = SigfigNumber.random(exponent, sigfigs);
			for (SigfigNumber existing : values) {
				if (Math.abs(value.doubleValue() - existing.doubleValue()) < min_diff) {
					good = false;
					break;
				}
			}
			if (good) {
				values.add(value);
				answers.add(formatAnswer(value, false));
			}
		}*/
		
		
		return answers;
	}
	
	/**
	 * Used to generate the question text displayed.
	 * 
	 * @return question - String question, this will be
	 * 		   displayed to the user
	 */
	public String getQuestionText() {
		String question = null;
		
		return question;
	}
	
	@Override
	/**
	 * Serves the question to the user. Depending on 
	 * the type variable, this method will either
	 * serve a multiple choice question or an open
	 * answer question.
	 * 
	 * @return GeneratedQuestion - object used to display 
	 * 		   a multiple choice or open answer question
	 */
	public GeneratedQuestion serveQuestion() {
		GeneratedQuestion gq = null;
		if (type == QuestionType.MULTIPLECHOICE) {
			MultipleChoiceQuestion mcq = new MultipleChoiceQuestion();
			mcq.setAnswers(getMultipleChoiceAnswers());
			mcq.prepareAnswers(answer_count, debugmode);
			gq = mcq;
		} else if (type == QuestionType.OPENANSWER) {
			DecimalQuestion dq = new DecimalQuestion();
			dq.setAnswer_formatted(answer.toStringMaybeSciNotation());
			double base = answer.doubleValue();
			double step = Math.pow(10, -answer.getDecimalDigits());
			dq.setAnswer_max(base+step);
			dq.setAnswer_min(base-step);
			dq.setSignificant_digits(answer.getSignificantDigits());
			if (dq.getSignificant_digits() <= 0) {
				// just in case
				dq.setSignificant_digits(null);
				dq.setDecimal_digits(answer.getDecimalDigits());
			}
			//dq.setAnswer_prefix("");
			//dq.setAnswer_postfix("");
			gq = dq;
		}
		if (gq != null) {
			gq.setQuestion_text(getQuestionText());
			gq.loadMetadata(problemtemplate_id);
			gq.setVersion(storeVersion());
			gq.setDistractors(storeDistractors());
			//gq.setDifficulty(difficulty);
			// TODO add critical skills
		}
		return gq;
	}
	
	public String storeDistractors()
	{
		HashMap<String, Object> dataMap = new HashMap<String, Object>();
		
		dataMap.put("Answer ", distractors.get(0));
		dataMap.put("A ", distractors.get(1));
		dataMap.put("B ", distractors.get(2));
		dataMap.put("C ", distractors.get(3));
		dataMap.put("D ", distractors.get(4));
		
		return dataMap.toString();
	}
	
	/**
	 * This method is for the 2018 Math Placement Exam.
	 * This method is to store the question data for a reporting
	 * service. This method will return a listing of all variables
	 * in this PTE
	 * 
	 * @return String the version
	 */
	public String storeVersion()
	{
		HashMap<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("a ", a)
		dataMap.put("b ", b)
		dataMap.put("c ", c)
		
		return dataMap.toString();
	}

	@Override
	public String getDebugInfo() {
		// TODO Auto-generated method stub
		return null;
	}

}