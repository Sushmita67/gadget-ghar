import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import axios from 'axios';
import API_BASE_URL from '@/config/api';

const PasswordStrengthIndicator = ({ password, userInfo = {}, onChange = () => {} }) => {
  const [strength, setStrength] = useState({
    score: 0,
    strength: 'Very Weak',
    feedback: [],
    color: 'gray',
    percentage: 0,
    isValid: false
  });
  const [isLoading, setIsLoading] = useState(false);

  // Debounced password strength check
  const checkPasswordStrength = useCallback(
    debounce(async (pwd, info) => {
      if (!pwd || pwd.length === 0) {
        setStrength({
          score: 0,
          strength: 'Very Weak',
          feedback: [],
          color: 'gray',
          percentage: 0,
          isValid: false
        });
        onChange({ score: 0, isValid: false });
        return;
      }

      if (pwd.length < 3) {
        setStrength({
          score: 0,
          strength: 'Very Weak',
          feedback: ['Password too short'],
          color: 'red',
          percentage: 0,
          isValid: false
        });
        onChange({ score: 0, isValid: false });
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.post(
          `${API_BASE_URL}/user/check-password-strength`,
          { password: pwd, userInfo: info }
        );

        if (response.data.success) {
          const result = response.data;
          setStrength({
            score: result.score || 0,
            strength: result.strength || 'Very Weak',
            feedback: result.feedback || [],
            color: result.color || 'gray',
            percentage: result.percentage || 0,
            isValid: result.isValid || false
          });
          onChange({ 
            score: result.score || 0, 
            isValid: result.isValid || false,
            strength: result.strength || 'Very Weak'
          });
        }
      } catch (error) {
        console.error('Password strength check failed:', error);
        // Fallback to client-side basic validation
        const basicStrength = getBasicStrength(pwd);
        setStrength(basicStrength);
        onChange({ 
          score: basicStrength.score, 
          isValid: basicStrength.isValid,
          strength: basicStrength.strength
        });
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  // Basic client-side password strength calculation as fallback
  const getBasicStrength = (pwd) => {
    let score = 0;
    let feedback = [];
    
    if (pwd.length >= 8) score += 1;
    else feedback.push('Use at least 8 characters');
    
    if (/[a-z]/.test(pwd)) score += 1;
    else feedback.push('Include lowercase letters');
    
    if (/[A-Z]/.test(pwd)) score += 1;
    else feedback.push('Include uppercase letters');
    
    if (/[0-9]/.test(pwd)) score += 1;
    else feedback.push('Include numbers');
    
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    else feedback.push('Include special characters');
    
    let strength, color;
    if (score <= 2) {
      strength = 'Very Weak';
      color = 'red';
    } else if (score <= 3) {
      strength = 'Weak';
      color = 'orange';
    } else if (score === 4) {
      strength = 'Good';
      color = 'yellow';
    } else {
      strength = 'Strong';
      color = 'green';
    }
    
    return {
      score,
      strength,
      feedback,
      color,
      percentage: (score / 5) * 100,
      isValid: score >= 4 && pwd.length >= 8
    };
  };

  useEffect(() => {
    checkPasswordStrength(password, userInfo);
  }, [password, userInfo, checkPasswordStrength]);

  const getColorClass = (color) => {
    switch (color) {
      case 'red': return 'bg-red-500';
      case 'orange': return 'bg-orange-500';
      case 'yellow': return 'bg-yellow-500';
      case 'lightgreen': return 'bg-green-400';
      case 'green': return 'bg-green-600';
      default: return 'bg-gray-300';
    }
  };

  const getTextColorClass = (color) => {
    switch (color) {
      case 'red': return 'text-red-600';
      case 'orange': return 'text-orange-600';
      case 'yellow': return 'text-yellow-600';
      case 'lightgreen': return 'text-green-500';
      case 'green': return 'text-green-700';
      default: return 'text-gray-500';
    }
  };

  if (!password || password.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getColorClass(strength.color)}`}
          style={{ width: `${strength.percentage}%` }}
        ></div>
      </div>
      
      {/* Strength Text */}
      <div className="flex items-center justify-between text-sm">
        <span className={`font-medium ${getTextColorClass(strength.color)}`}>
          {isLoading ? 'Checking...' : strength.strength}
        </span>
        <span className="text-gray-500 text-xs">
          {Math.round(strength.percentage)}%
        </span>
      </div>
      
      {/* Feedback */}
      {strength.feedback && strength.feedback.length > 0 && (
        <div className="text-xs space-y-1">
          {strength.feedback.slice(0, 3).map((tip, index) => (
            <div key={index} className="flex items-start space-x-1">
              <span className="text-gray-400 mt-0.5">•</span>
              <span className="text-gray-600 dark:text-gray-400">{tip}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Validation Status */}
      {password.length >= 8 && (
        <div className="flex items-center space-x-1 text-xs">
          {strength.isValid ? (
            <>
              <span className="text-green-600">✓</span>
              <span className="text-green-600">Password meets requirements</span>
            </>
          ) : (
            <>
              <span className="text-red-600">⚠</span>
              <span className="text-red-600">Password does not meet minimum requirements</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;